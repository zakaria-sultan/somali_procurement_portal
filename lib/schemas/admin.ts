import { z } from "zod";

export const tenderCategorySchema = z.enum([
  "Tenders",
  "RFQ",
  "Prequalification",
  "Framework",
  "Auction",
]);

export const tenderIdSchema = z.object({
  id: z.string().min(1).max(64),
});

const reqRow = z.object({
  item: z.string().max(50),
  description: z.string().max(50_000),
  unit: z.string().max(80),
  quantity: z.string().max(80),
});

const contactShape = z.object({
  email: z.string().email().max(200),
  phoneDisplay: z.string().min(3).max(80),
  phoneTel: z.string().min(3).max(40),
  whatsappDigits: z.string().min(5).max(20),
});

const docItem = z.object({
  name: z.string().min(1).max(500),
  href: z.string().min(1).max(2000),
  downloadAs: z.string().max(500).optional(),
});

/** Admin tender form — flat fields, no JSON textareas. */
export const tenderFormSchema = z.object({
  title: z.string().trim().min(3).max(500),
  organization: z.string().trim().min(2).max(200),
  category: tenderCategorySchema,
  location: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(50_000),
  organizationBlurb: z.string().trim().max(10_000).optional().default(""),
  postedDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  requirementsHtml: z.string().max(300_000).optional().default(""),
  howToApply: z.string().max(100_000).optional().default(""),
  contactEmail: z.string().trim().email().max(200),
  contactPhoneDisplay: z.string().trim().min(3).max(80),
  contactPhoneTel: z.string().trim().min(3).max(40),
  contactWhatsappDigits: z.string().trim().min(5).max(20),
});

export type TenderFormInput = z.infer<typeof tenderFormSchema>;

export function tenderContactFromForm(
  data: TenderFormInput
): z.infer<typeof contactShape> {
  return contactShape.parse({
    email: data.contactEmail,
    phoneDisplay: data.contactPhoneDisplay,
    phoneTel: data.contactPhoneTel,
    whatsappDigits: data.contactWhatsappDigits,
  });
}

/** One block of text → single requirement row for storage / display. */
export function requirementsFromPlainText(
  text: string
): z.infer<typeof reqRow>[] {
  const t = text.trim();
  if (!t) return [];
  return [
    {
      item: "—",
      description: t.slice(0, 50_000),
      unit: "",
      quantity: "",
    },
  ];
}

/** Edit form default from stored requirement rows. */
export function requirementsToPlainText(
  rows: z.infer<typeof reqRow>[]
): string {
  return rows
    .map((r) => r.description.trim())
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 50_000);
}

export { contactShape, docItem, reqRow };

/** Marketplace admin form — flat fields (no JSON textareas). */
export const marketplaceFormSchema = z.object({
  title: z.string().trim().min(3).max(500),
  price: z.string().trim().min(1).max(120),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(50_000),
  seller: z.string().trim().min(2).max(200),
  contactEmail: z.string().trim().email().max(200),
  contactPhoneDisplay: z.string().trim().min(3).max(80),
  contactPhoneTel: z.string().trim().min(3).max(40),
  contactWhatsappDigits: z.string().trim().min(5).max(20),
});

export type MarketplaceFormInput = z.infer<typeof marketplaceFormSchema>;

export function marketplaceContactFromForm(
  data: MarketplaceFormInput
): z.infer<typeof contactShape> {
  return contactShape.parse({
    email: data.contactEmail,
    phoneDisplay: data.contactPhoneDisplay,
    phoneTel: data.contactPhoneTel,
    whatsappDigits: data.contactWhatsappDigits,
  });
}

/** Collect optional bullet highlights: multiple inputs named `highlight`. */
export function highlightsFromFormData(formData: FormData): string[] {
  const raw = formData.getAll("highlight");
  return raw
    .map((v) => String(v ?? "").trim())
    .filter((s) => s.length > 0)
    .map((s) => s.slice(0, 500))
    .slice(0, 12);
}

export const blogUpsertSchema = z.object({
  title: z.string().trim().min(3).max(500),
  content: z.string().trim().min(20).max(100_000),
  author: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(120),
  imageUrl: z.preprocess(
    (v) =>
      v === "" || v === null || v === undefined ? undefined : String(v).trim(),
    z.string().max(2000).optional()
  ),
});
