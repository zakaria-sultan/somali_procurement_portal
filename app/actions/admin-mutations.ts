"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin } from "@/app/actions/admin-guard";
import { mapTenderDetail } from "@/lib/db-map";
import {
  blogUpsertSchema,
  highlightsFromFormData,
  marketplaceContactFromForm,
  marketplaceFormSchema,
  requirementsFromPlainText,
  tenderContactFromForm,
  tenderFormSchema,
  tenderIdSchema,
} from "@/lib/schemas/admin";
import { putAdminBlob } from "@/lib/blob-upload";
import prisma from "@/lib/prisma";
import type { TenderDocument } from "@/lib/types";

export type AdminActionState = { ok: boolean; message: string };

const DOC_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function isAllowedDocFile(file: File): boolean {
  if (DOC_MIME.has(file.type)) return true;
  if (!file.type || file.type === "application/octet-stream") {
    return /\.(pdf|doc|docx)$/i.test(file.name);
  }
  return false;
}

async function tenderDocumentsFromForm(
  formData: FormData,
  previous: TenderDocument[]
): Promise<TenderDocument[] | { error: string }> {
  const removeIndices = new Set(
    formData
      .getAll("removeDocument")
      .map((v) => Number.parseInt(String(v), 10))
      .filter((n) => Number.isInteger(n) && n >= 0)
  );
  const list = previous.filter((_, index) => !removeIndices.has(index));
  const entries = formData.getAll("documents");
  for (const entry of entries) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (!isAllowedDocFile(entry)) {
      return {
        error: `${entry.name}: use PDF or Word (.doc, .docx) only.`,
      };
    }
    if (entry.size > 10 * 1024 * 1024) {
      return { error: `${entry.name} is too large (max 10 MB).` };
    }
    try {
      const href = await putAdminBlob(entry);
      list.push({
        name: entry.name.replace(/[^\w.\- ]/g, "_").slice(0, 200),
        href,
        downloadAs: entry.name,
      });
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Document upload failed.",
      };
    }
  }
  if (list.length === 0) {
    return {
      error: "Add at least one tender document (PDF or Word).",
    };
  }
  return list;
}

async function tenderLogoFromForm(
  formData: FormData,
  existing: string | null
): Promise<string | null | { error: string }> {
  if (formData.get("clearOrganizationLogo") === "on") {
    return null;
  }
  const file = formData.get("organizationLogo") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return { error: "Organization logo must be an image (PNG, JPG, WebP, etc.)." };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Logo must be 5 MB or smaller." };
    }
    try {
      return await putAdminBlob(file);
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Logo upload failed.",
      };
    }
  }
  const hidden = String(formData.get("organizationLogoUrl") ?? "").trim();
  if (hidden) return hidden;
  return existing;
}

function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/tenders");
  revalidatePath("/marketplace");
  revalidatePath("/blogs");
}

export async function uploadAdminFile(formData: FormData): Promise<string> {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file?.size) throw new Error("No file uploaded.");
  return putAdminBlob(file);
}

export async function createTender(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertAdmin();
  const raw = {
    title: formData.get("title"),
    organization: formData.get("organization"),
    category: formData.get("category"),
    location: formData.get("location"),
    description: formData.get("description"),
    organizationBlurb: formData.get("organizationBlurb") ?? "",
    postedDate: formData.get("postedDate"),
    expiryDate: formData.get("expiryDate"),
    requirementsText: formData.get("requirementsText") ?? "",
    contactEmail: formData.get("contactEmail"),
    contactPhoneDisplay: formData.get("contactPhoneDisplay"),
    contactPhoneTel: formData.get("contactPhoneTel"),
    contactWhatsappDigits: formData.get("contactWhatsappDigits"),
  };
  const parsed = tenderFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const documents = await tenderDocumentsFromForm(formData, []);
  if (!Array.isArray(documents)) {
    return { ok: false, message: documents.error };
  }

  const logoResult = await tenderLogoFromForm(formData, null);
  if (typeof logoResult === "object" && logoResult !== null && "error" in logoResult) {
    return { ok: false, message: logoResult.error };
  }

  const requirements = requirementsFromPlainText(parsed.data.requirementsText);
  const contact = tenderContactFromForm(parsed.data);

  try {
    await prisma.tender.create({
      data: {
        title: parsed.data.title,
        organization: parsed.data.organization,
        category: parsed.data.category,
        location: parsed.data.location,
        postedDate: parsed.data.postedDate,
        expiryDate: parsed.data.expiryDate,
        description: parsed.data.description,
        organizationBlurb: parsed.data.organizationBlurb ?? "",
        organizationLogoUrl: logoResult,
        documents: documents as unknown as Prisma.InputJsonValue,
        detailRows: [] as unknown as Prisma.InputJsonValue,
        requirements: requirements as unknown as Prisma.InputJsonValue,
        contact: contact as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not create tender.",
    };
  }
  revalidatePublicSite();
  redirect("/admin/tenders");
}

export async function updateTender(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertAdmin();
  const idRaw = formData.get("id");
  const idParsed = tenderIdSchema.safeParse({ id: idRaw });
  if (!idParsed.success) {
    return { ok: false, message: "Invalid tender id." };
  }

  const existingRow = await prisma.tender.findUnique({
    where: { id: idParsed.data.id },
  });
  if (!existingRow) {
    return { ok: false, message: "Tender not found." };
  }
  const existingDetail = mapTenderDetail(existingRow);

  const raw = {
    title: formData.get("title"),
    organization: formData.get("organization"),
    category: formData.get("category"),
    location: formData.get("location"),
    description: formData.get("description"),
    organizationBlurb: formData.get("organizationBlurb") ?? "",
    postedDate: formData.get("postedDate"),
    expiryDate: formData.get("expiryDate"),
    requirementsText: formData.get("requirementsText") ?? "",
    contactEmail: formData.get("contactEmail"),
    contactPhoneDisplay: formData.get("contactPhoneDisplay"),
    contactPhoneTel: formData.get("contactPhoneTel"),
    contactWhatsappDigits: formData.get("contactWhatsappDigits"),
  };
  const parsed = tenderFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const documents = await tenderDocumentsFromForm(
    formData,
    existingDetail.documents
  );
  if (!Array.isArray(documents)) {
    return { ok: false, message: documents.error };
  }

  const logoResult = await tenderLogoFromForm(
    formData,
    existingRow.organizationLogoUrl
  );
  if (typeof logoResult === "object" && logoResult !== null && "error" in logoResult) {
    return { ok: false, message: logoResult.error };
  }

  const requirements = requirementsFromPlainText(parsed.data.requirementsText);
  const contact = tenderContactFromForm(parsed.data);

  try {
    await prisma.tender.update({
      where: { id: idParsed.data.id },
      data: {
        title: parsed.data.title,
        organization: parsed.data.organization,
        category: parsed.data.category,
        location: parsed.data.location,
        postedDate: parsed.data.postedDate,
        expiryDate: parsed.data.expiryDate,
        description: parsed.data.description,
        organizationBlurb: parsed.data.organizationBlurb ?? "",
        organizationLogoUrl: logoResult,
        documents: documents as unknown as Prisma.InputJsonValue,
        detailRows: [] as unknown as Prisma.InputJsonValue,
        requirements: requirements as unknown as Prisma.InputJsonValue,
        contact: contact as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not update tender.",
    };
  }
  revalidatePublicSite();
  redirect("/admin/tenders");
}

export async function deleteTender(formData: FormData) {
  await assertAdmin();
  const idParsed = tenderIdSchema.safeParse({ id: formData.get("id") });
  if (!idParsed.success) {
    redirect("/admin/tenders?deleteError=invalid");
  }
  const result = await prisma.tender.deleteMany({
    where: { id: idParsed.data.id },
  });
  revalidatePublicSite();
  if (result.count === 0) {
    redirect("/admin/tenders?deleteError=notfound");
  }
  redirect("/admin/tenders?deleted=1");
}

export async function createMarketplaceListing(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertAdmin();
  const image = formData.get("image") as File | null;
  let imageUrl = String(formData.get("imageUrl") ?? "").trim();
  try {
    if (image && image.size > 0) {
      imageUrl = await putAdminBlob(image);
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Image upload failed.",
    };
  }
  const raw = {
    title: formData.get("title"),
    price: formData.get("price"),
    category: formData.get("category"),
    description: formData.get("description"),
    seller: formData.get("seller"),
    contactEmail: formData.get("contactEmail"),
    contactPhoneDisplay: formData.get("contactPhoneDisplay"),
    contactPhoneTel: formData.get("contactPhoneTel"),
    contactWhatsappDigits: formData.get("contactWhatsappDigits"),
  };
  const parsed = marketplaceFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }
  if (!imageUrl) {
    return { ok: false, message: "Provide an image file or image URL." };
  }
  try {
    const highlights = highlightsFromFormData(formData);
    const contact = marketplaceContactFromForm(parsed.data);
    await prisma.marketplaceListing.create({
      data: {
        title: parsed.data.title,
        price: parsed.data.price,
        category: parsed.data.category,
        description: parsed.data.description,
        seller: parsed.data.seller,
        imageUrl,
        highlights: highlights as unknown as Prisma.InputJsonValue,
        contact: contact as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not create listing.",
    };
  }
  revalidatePublicSite();
  redirect("/admin/marketplace");
}

export async function updateMarketplaceListing(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertAdmin();
  const idParsed = tenderIdSchema.safeParse({ id: formData.get("id") });
  if (!idParsed.success) {
    return { ok: false, message: "Invalid listing id." };
  }
  const image = formData.get("image") as File | null;
  let imageUrl = String(formData.get("imageUrl") ?? "").trim();
  try {
    if (image && image.size > 0) {
      imageUrl = await putAdminBlob(image);
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Image upload failed.",
    };
  }
  const raw = {
    title: formData.get("title"),
    price: formData.get("price"),
    category: formData.get("category"),
    description: formData.get("description"),
    seller: formData.get("seller"),
    contactEmail: formData.get("contactEmail"),
    contactPhoneDisplay: formData.get("contactPhoneDisplay"),
    contactPhoneTel: formData.get("contactPhoneTel"),
    contactWhatsappDigits: formData.get("contactWhatsappDigits"),
  };
  const parsed = marketplaceFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }
  const existing = await prisma.marketplaceListing.findUnique({
    where: { id: idParsed.data.id },
  });
  if (!existing) return { ok: false, message: "Listing not found." };
  const finalImage = imageUrl || existing.imageUrl;
  if (!finalImage) {
    return { ok: false, message: "Image required." };
  }
  try {
    const highlights = highlightsFromFormData(formData);
    const contact = marketplaceContactFromForm(parsed.data);
    await prisma.marketplaceListing.update({
      where: { id: idParsed.data.id },
      data: {
        title: parsed.data.title,
        price: parsed.data.price,
        category: parsed.data.category,
        description: parsed.data.description,
        seller: parsed.data.seller,
        imageUrl: finalImage,
        highlights: highlights as unknown as Prisma.InputJsonValue,
        contact: contact as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not update listing.",
    };
  }
  revalidatePublicSite();
  redirect("/admin/marketplace");
}

export async function deleteMarketplaceListing(formData: FormData) {
  await assertAdmin();
  const idParsed = tenderIdSchema.safeParse({ id: formData.get("id") });
  if (!idParsed.success) {
    redirect("/admin/marketplace?deleteError=invalid");
  }
  const result = await prisma.marketplaceListing.deleteMany({
    where: { id: idParsed.data.id },
  });
  revalidatePublicSite();
  if (result.count === 0) {
    redirect("/admin/marketplace?deleteError=notfound");
  }
  redirect("/admin/marketplace?deleted=1");
}

export async function createBlogPost(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertAdmin();
  const image = formData.get("image") as File | null;
  let imageUrl: string | undefined = String(formData.get("imageUrl") ?? "").trim() || undefined;
  try {
    if (image && image.size > 0) {
      imageUrl = await putAdminBlob(image);
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Image upload failed.",
    };
  }
  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    author: formData.get("author"),
    category: formData.get("category"),
    imageUrl: imageUrl ?? "",
  };
  const parsed = blogUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }
  try {
    await prisma.blog.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        author: parsed.data.author,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
      },
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not create article.",
    };
  }
  revalidatePublicSite();
  redirect("/admin/blogs");
}

export async function updateBlogPost(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertAdmin();
  const idParsed = tenderIdSchema.safeParse({ id: formData.get("id") });
  if (!idParsed.success) {
    return { ok: false, message: "Invalid article id." };
  }
  const image = formData.get("image") as File | null;
  let imageUrl: string | undefined = String(formData.get("imageUrl") ?? "").trim() || undefined;
  try {
    if (image && image.size > 0) {
      imageUrl = await putAdminBlob(image);
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Image upload failed.",
    };
  }
  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    author: formData.get("author"),
    category: formData.get("category"),
    imageUrl: imageUrl ?? "",
  };
  const parsed = blogUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }
  const existing = await prisma.blog.findUnique({
    where: { id: idParsed.data.id },
  });
  if (!existing) return { ok: false, message: "Article not found." };
  try {
    await prisma.blog.update({
      where: { id: idParsed.data.id },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        author: parsed.data.author,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl ?? existing.imageUrl,
      },
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not update article.",
    };
  }
  revalidatePublicSite();
  redirect("/admin/blogs");
}

export async function deleteBlogPost(formData: FormData) {
  await assertAdmin();
  const idParsed = tenderIdSchema.safeParse({ id: formData.get("id") });
  if (!idParsed.success) {
    redirect("/admin/blogs?deleteError=invalid");
  }
  const result = await prisma.blog.deleteMany({
    where: { id: idParsed.data.id },
  });
  revalidatePublicSite();
  if (result.count === 0) {
    redirect("/admin/blogs?deleteError=notfound");
  }
  redirect("/admin/blogs?deleted=1");
}
