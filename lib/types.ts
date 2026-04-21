export type ProcurementCategory =
  | "All"
  | "Tenders"
  | "RFQ"
  | "Prequalification"
  | "Framework"
  | "Auction";

export type Tender = {
  id: string;
  title: string;
  organization: string;
  category: Exclude<ProcurementCategory, "All">;
  dateLabel: string;
  location: string;
  /** Organization / buyer logo for listings and detail */
  organizationLogoUrl?: string | null;
};

export type TenderRequirementRow = {
  item: string;
  description: string;
  unit: string;
  quantity: string;
};

export type TenderDocument = {
  name: string;
  href: string;
  /** Suggested filename when saving (HTML download attribute) */
  downloadAs?: string;
};

export type PartyContact = {
  email: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappDigits: string;
};

export type TenderDetail = Tender & {
  description: string;
  organizationBlurb: string;
  expiryLabel: string;
  requirements: TenderRequirementRow[];
  /** Rich-text requirements (sanitized HTML). When set, preferred over `requirements` rows. */
  requirementsHtml: string;
  /** Application instructions (sanitized HTML). */
  howToApply: string;
  documents: TenderDocument[];
  contact: PartyContact;
};

export type MarketplaceItem = {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
};

export type MarketplaceDetail = MarketplaceItem & {
  description: string;
  seller: string;
  highlights: string[];
  contact: PartyContact;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  /** Cover image (Blob URL or `/api/blob/...` when private). */
  imageUrl?: string | null;
};

export type BlogDetail = BlogPost & {
  paragraphs: string[];
  imageUrl?: string | null;
};

export type TendersQuery = {
  q?: string;
  location?: string;
  category?: string;
  sort?: "newest" | "oldest";
  dateWindow?: "any" | "24h" | "3d" | "7d" | "30d";
};
