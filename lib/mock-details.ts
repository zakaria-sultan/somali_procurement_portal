import { SITE_CONTACT } from "@/lib/contact-constants";
import { mockBlogs, mockMarketplace, mockTenders } from "@/lib/mock-data";
import type {
  BlogDetail,
  MarketplaceDetail,
  PartyContact,
  Tender,
  TenderDetail,
} from "@/lib/types";

type TenderExtra = Omit<
  TenderDetail,
  keyof Tender | "requirementsHtml" | "howToApply" | "descriptionHtml"
> & {
  requirementsHtml?: string;
  howToApply?: string;
  descriptionHtml?: string;
};

function sitePhones(): Pick<
  PartyContact,
  "phoneDisplay" | "phoneTel" | "whatsappDigits"
> {
  return {
    phoneDisplay: SITE_CONTACT.phoneDisplay,
    phoneTel: SITE_CONTACT.phoneTel,
    whatsappDigits: SITE_CONTACT.whatsappDigits,
  };
}

const tenderExtras: Partial<Record<string, TenderExtra>> = {
  t1: {
    description:
      "The Federal Ministry of Health seeks qualified suppliers to deliver essential medical consumables and cold-chain items to public health facilities in Mogadishu. Bidders must demonstrate prior supply experience in fragile contexts and provide manufacturer authorization where applicable.",
    organizationBlurb:
      "The ministry coordinates national health policy, public hospital networks, and emergency medical logistics across Federal Member States.",
    expiryLabel: "May 02, 2026",
    contact: {
      email: "procurement@health.gov.example",
      ...sitePhones(),
    },
    requirements: [
      {
        item: "1",
        description: "Surgical gloves (latex-free, assorted sizes)",
        unit: "Carton",
        quantity: "120",
      },
      {
        item: "2",
        description: "IV infusion sets (sterile, single use)",
        unit: "Unit",
        quantity: "18,000",
      },
      {
        item: "3",
        description: "Cold-chain temperature loggers",
        unit: "Unit",
        quantity: "40",
      },
    ],
    documents: [
      {
        name: "RFQ specification (PDF)",
        href: "/documents/sample-notice.pdf",
        downloadAs: "FMoH-RFQ-2026-014-specification.pdf",
      },
      {
        name: "Bill of quantities (XLSX)",
        href: "/documents/sample-boq.xlsx",
        downloadAs: "FMoH-RFQ-2026-014-BOQ.xlsx",
      },
      {
        name: "Code of conduct for suppliers (PDF)",
        href: "/documents/sample-notice.pdf",
        downloadAs: "FMoH-code-of-conduct-suppliers.pdf",
      },
    ],
  },
  t2: {
    description:
      "The Danish Refugee Council (DRC) invites sealed quotations for the construction and equipping of eight community centres across Galmudug. Works include civil works, WASH connections, and furnishing with durable plastic seating as specified in the BOQ.",
    organizationBlurb:
      "DRC is an international NGO delivering humanitarian assistance and durable solutions programming in Somalia with a focus on protection and livelihoods.",
    expiryLabel: "Apr 23, 2026",
    contact: {
      email: "somalia.procurement@drc.example",
      ...sitePhones(),
    },
    requirements: [
      {
        item: "1",
        description: "Civil works — community centre shells (8 sites)",
        unit: "Lot",
        quantity: "8",
      },
      {
        item: "2",
        description: "Plastic chairs (12 per centre)",
        unit: "Each",
        quantity: "96",
      },
      {
        item: "3",
        description: "Plastic tables (1 per centre)",
        unit: "Each",
        quantity: "8",
      },
    ],
    documents: [
      {
        name: "Technical drawings (ZIP)",
        href: "/documents/sample-drawings.zip",
        downloadAs: "DRC-SOM-GAL-2026-883-drawings.zip",
      },
      {
        name: "Environmental checklist (PDF)",
        href: "/documents/sample-notice.pdf",
        downloadAs: "DRC-environmental-checklist.pdf",
      },
    ],
  },
};

function defaultTenderExtra(base: Tender): TenderExtra {
  return {
    description: `${base.organization} is soliciting offers for: ${base.title}. Please review the downloadable instructions before preparing your submission.`,
    organizationBlurb: `${base.organization} publishes procurement notices on Somali Procurement Portal to reach qualified local and international vendors.`,
    expiryLabel: "May 15, 2026",
    contact: {
      email: SITE_CONTACT.email,
      ...sitePhones(),
    },
    requirements: [
      {
        item: "1",
        description: "Goods / services per scope of work",
        unit: "Lot",
        quantity: "1",
      },
    ],
    documents: [
      {
        name: "Instructions to bidders (PDF)",
        href: "/documents/sample-notice.pdf",
        downloadAs: "instructions-to-bidders.pdf",
      },
      {
        name: "Draft contract (PDF)",
        href: "/documents/sample-notice.pdf",
        downloadAs: "draft-contract.pdf",
      },
    ],
    requirementsHtml: "",
    howToApply: "",
    descriptionHtml: "",
  };
}

export function buildTenderDetail(id: string): TenderDetail | null {
  const base = mockTenders.find((t) => t.id === id);
  if (!base) return null;
  const extra = tenderExtras[id] ?? defaultTenderExtra(base);
  return {
    ...base,
    ...extra,
    descriptionHtml: extra.descriptionHtml ?? "",
    requirementsHtml: extra.requirementsHtml ?? "",
    howToApply: extra.howToApply ?? "",
  };
}

type MarketplaceExtra = Pick<
  MarketplaceDetail,
  "description" | "seller" | "highlights" | "contact"
>;

const seller = (
  email: string,
  phoneDisplay: string,
  phoneTel: string,
  whatsappDigits: string
): PartyContact => ({ email, phoneDisplay, phoneTel, whatsappDigits });

const marketplaceDetails: Record<string, MarketplaceExtra> = {
  m1: {
    description:
      "Corner parcel with verified title chain, suitable for mixed commercial use. Utilities within 50m of the boundary; access road recently graded.",
    seller: "Hargeisa Land Desk",
    highlights: ["Title reviewed", "Walk-through available", "Attorney intro included"],
    contact: seller(
      "listings@hargeisaland.example",
      "+252 63 711 0200",
      "+252637110200",
      "252637110200"
    ),
  },
  m2: {
    description:
      "CAT-class excavator with operator, fuel surcharge quoted separately. Weekly minimums apply; mobilization to site within 72 hours in Garowe–Hargeisa corridor.",
    seller: "Golis Equipment Rentals",
    highlights: ["Operator included", "Maintenance on us", "Insurance bundled"],
    contact: seller(
      "fleet@golisrentals.example",
      "+252 63 722 0300",
      "+252637220300",
      "252637220300"
    ),
  },
  m3: {
    description:
      "Editable Word templates aligned to common donor procurement policies — includes RFQ cover, evaluation matrix, and contract schedule placeholders.",
    seller: "SPP Templates Studio",
    highlights: ["Instant download", "MAC + Windows", "12-month updates"],
    contact: seller(
      "templates@somaliprocurementportal.com",
      SITE_CONTACT.phoneDisplay,
      SITE_CONTACT.phoneTel,
      SITE_CONTACT.whatsappDigits
    ),
  },
  m4: {
    description:
      "ThermoKing-equivalent unit, recently serviced, complete with tail-lift and temperature printer. Ideal for vaccine or perishable lanes.",
    seller: "ColdRun Logistics",
    highlights: ["Service records", "Test drive in Mogadishu", "Financing partners"],
    contact: seller(
      "dispatch@coldrun.example",
      "+252 61 933 0440",
      "+252619330440",
      "252619330440"
    ),
  },
  m5: {
    description:
      "Surplus from a completed NGO field office — desks, mesh chairs, filing cabinets, and meeting tables sold as one lot.",
    seller: "FieldWorks Liquidation",
    highlights: ["As-is inspection", "Loading help day-of", "Tax letter on request"],
    contact: seller(
      "sales@fieldworks.example",
      "+252 63 744 0550",
      "+252637440550",
      "252637440550"
    ),
  },
  m6: {
    description:
      "IMO-compliant PPE bundle for stevedoring teams — harnesses, VHF handhelds, and immersion suits sized medium/large.",
    seller: "BluePort Safety",
    highlights: ["Batch certificates", "Training deck included", "Warranty 12 mo"],
    contact: seller(
      "orders@blueport.example",
      "+252 65 855 0660",
      "+252658550660",
      "252658550660"
    ),
  },
};

export function buildMarketplaceDetail(id: string): MarketplaceDetail | null {
  const base = mockMarketplace.find((m) => m.id === id);
  if (!base) return null;
  const d = marketplaceDetails[id] ?? {
    description: `${base.title} — contact the seller through Somali Procurement Portal messaging (coming soon).`,
    seller: "Verified seller",
    highlights: ["Secure checkout soon", "SPP buyer protection"],
    contact: seller(
      SITE_CONTACT.email,
      SITE_CONTACT.phoneDisplay,
      SITE_CONTACT.phoneTel,
      SITE_CONTACT.whatsappDigits
    ),
  };
  return { ...base, ...d };
}

const blogDetails: Record<string, { paragraphs: string[] }> = {
  b1: {
    paragraphs: [
      "Federal ministries and major NGOs are converging on shorter RFQ cycles with fixed clarification windows. For suppliers, that means tighter document control and faster turnaround on pricing.",
      "Expect more consolidated framework agreements in medical supplies and ICT hardware, with performance KPIs published up front. Smaller vendors should partner on logistics rather than bidding cold on large lots.",
      "Watch for digital signature pilots tied to tender portals — physical seals will remain required for several categories through 2026.",
    ],
  },
  b2: {
    paragraphs: [
      "Framework agreements reward suppliers who keep compliance files evergreen. Maintain signed code-of-conduct statements, tax certificates, and bank references in a single PDF pack.",
      "Use the pre-bid Q&A window aggressively — clarifications often narrow the scope and reduce risk of non-responsive bids.",
    ],
  },
  b3: {
    paragraphs: [
      "Carriers are stitching together Bosaso–Garowe–Galkacyo routes with shared consolidation hubs. That lowers per-pallet rates for NGOs sourcing in multiple towns.",
      "If you are bidding construction materials, ask whether the buyer will accept phased deliveries to these shared hubs instead of direct-to-site drops.",
    ],
  },
  b4: {
    paragraphs: [
      "Solar plus battery replacements for diesel gensets are cutting fuel spend by 35–50% in three pilot hospitals. Procurement teams packaged panels, inverters, and training in one RFQ to simplify evaluation.",
      "Battery warranties and local O&M partners were weighted as highly as capex — a signal to vendors to bundle service, not just hardware.",
    ],
  },
  b5: {
    paragraphs: [
      "Federal submissions now accept qualified e-signatures on technical volumes, but financial guarantees still require wet ink from authorized signatories in most cases.",
      "Keep an audit trail: timestamped submission receipts, hash copies of PDFs, and email confirmations from the tender box administrator.",
    ],
  },
  b6: {
    paragraphs: [
      "Regional banks are rolling out smaller bid-bond products with digital issuance. SMEs report faster approvals when they attach two years of audited statements plus a procurement reference letter.",
      "Pair bonds with insurance-backed performance guarantees where the buyer allows — it can reduce working capital strain.",
    ],
  },
};

export function buildBlogDetail(id: string): BlogDetail | null {
  const base = mockBlogs.find((b) => b.id === id);
  if (!base) return null;
  const extra = blogDetails[id] ?? {
    paragraphs: [
      `${base.excerpt} This article is part of the Somali Procurement Portal knowledge base — full multimedia features arrive in a later release.`,
    ],
  };
  return { ...base, ...extra };
}