"use server";

import { redirect } from "next/navigation";

import { assertAdmin } from "@/app/actions/admin-guard";
import prisma from "@/lib/prisma";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";
import { tenderIdSchema } from "@/lib/schemas/admin";

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
