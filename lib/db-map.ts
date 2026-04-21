import type {
  BlogDetail,
  BlogPost,
  MarketplaceDetail,
  MarketplaceItem,
  PartyContact,
  Tender,
  TenderDetail,
  TenderDocument,
  TenderRequirementRow,
} from "@/lib/types";
import { formatExpiryLabel, formatPostedLabel } from "@/lib/format-posted";
import type { Blog, MarketplaceListing, Tender as PrismaTender } from "@prisma/client";

function asPartyContact(raw: unknown): PartyContact {
  const o =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    email: String(o.email ?? "info@somaliprocurementportal.com"),
    phoneDisplay: String(o.phoneDisplay ?? "+252 63 000 0000"),
    phoneTel: String(o.phoneTel ?? "+252630000000"),
    whatsappDigits: String(o.whatsappDigits ?? "252630000000"),
  };
}

function asDocs(raw: unknown): TenderDocument[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (d): d is TenderDocument =>
      !!d &&
      typeof d === "object" &&
      "name" in d &&
      "href" in d &&
      typeof (d as TenderDocument).name === "string" &&
      typeof (d as TenderDocument).href === "string"
  );
}

function asRequirements(raw: unknown): TenderRequirementRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (r): r is TenderRequirementRow =>
      !!r &&
      typeof r === "object" &&
      "item" in r &&
      "description" in r &&
      "unit" in r &&
      "quantity" in r
  );
}

export function mapTenderList(row: PrismaTender): Tender {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    category: row.category as Tender["category"],
    location: row.location,
    dateLabel: formatPostedLabel(row.postedDate),
    organizationLogoUrl: row.organizationLogoUrl ?? null,
  };
}

export function mapTenderDetail(row: PrismaTender): TenderDetail {
  const base = mapTenderList(row);
  return {
    ...base,
    description: row.description,
    organizationBlurb: row.organizationBlurb,
    expiryLabel: formatExpiryLabel(row.expiryDate),
    requirements: asRequirements(row.requirements),
    requirementsHtml: row.requirementsHtml ?? "",
    howToApply: row.howToApply ?? "",
    documents: asDocs(row.documents),
    contact: asPartyContact(row.contact),
  };
}

export function mapMarketplaceList(row: MarketplaceListing): MarketplaceItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: row.price,
    imageUrl: row.imageUrl,
  };
}

export function mapMarketplaceDetail(row: MarketplaceListing): MarketplaceDetail {
  const base = mapMarketplaceList(row);
  const highlights = Array.isArray(row.highlights)
    ? (row.highlights as unknown[]).filter((h): h is string => typeof h === "string")
    : [];
  return {
    ...base,
    description: row.description,
    seller: row.seller,
    highlights,
    contact: asPartyContact(row.contact),
  };
}

export function mapBlogList(row: Blog): BlogPost {
  const paragraphs = contentToParagraphs(row.content);
  const excerptSource = paragraphs[0] ?? row.title;
  return {
    id: row.id,
    title: row.title,
    excerpt:
      excerptSource.length > 180
        ? `${excerptSource.slice(0, 177)}…`
        : excerptSource,
    category: row.category,
    author: row.author,
    date: row.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    imageUrl: row.imageUrl ?? null,
  };
}

export function mapBlogDetail(row: Blog): BlogDetail {
  return {
    ...mapBlogList(row),
    paragraphs: contentToParagraphs(row.content),
    imageUrl: row.imageUrl,
  };
}

export function contentToParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function joinBlogParagraphs(paragraphs: string[]): string {
  return paragraphs.map((p) => p.trim()).filter(Boolean).join("\n\n");
}
