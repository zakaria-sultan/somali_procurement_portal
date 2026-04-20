import type { BlogPost, MarketplaceItem, Tender } from "@/lib/types";

export const mockTenders: Tender[] = [
  {
    id: "t1",
    title: "Request for Quotation — Medical Supplies for Mogadishu Health Centers",
    organization: "Federal Ministry of Health & Human Services",
    category: "RFQ",
    dateLabel: "Today",
    location: "Mogadishu",
  },
  {
    id: "t2",
    title: "Construction of Rural Water Boreholes — Galmudug Region",
    organization: "Danish Refugee Council (DRC)",
    category: "Tenders",
    dateLabel: "Yesterday",
    location: "Galkacyo",
  },
  {
    id: "t3",
    title: "Prequalification of Suppliers — ICT Hardware & Networking",
    organization: "Hormuud Telecom Foundation",
    category: "Prequalification",
    dateLabel: "Apr 17, 2026",
    location: "Hargeisa",
  },
  {
    id: "t4",
    title: "Framework Agreement — Office Stationery & Consumables (24 months)",
    organization: "Save the Children Somalia",
    category: "Framework",
    dateLabel: "Apr 16, 2026",
    location: "Garowe",
  },
  {
    id: "t5",
    title: "Supply & Delivery of Agricultural Inputs — Bay Region Cooperatives",
    organization: "FAO Somalia",
    category: "Tenders",
    dateLabel: "Apr 15, 2026",
    location: "Baidoa",
  },
  {
    id: "t6",
    title: "Reverse Auction — Vehicle Leasing Services",
    organization: "World Food Programme",
    category: "Auction",
    dateLabel: "Apr 14, 2026",
    location: "Mogadishu",
  },
  {
    id: "t7",
    title: "Consultancy — Public Financial Management Reform",
    organization: "World Bank (Federal Government of Somalia)",
    category: "Tenders",
    dateLabel: "Apr 12, 2026",
    location: "Mogadishu",
  },
  {
    id: "t8",
    title: "RFQ — Solar Street Lighting for Bossaso Port Access Roads",
    organization: "Puntland Ministry of Ports & Maritime Transport",
    category: "RFQ",
    dateLabel: "Apr 10, 2026",
    location: "Bossaso",
  },
];

export const mockMarketplace: MarketplaceItem[] = [
  {
    id: "m1",
    title: "Prime commercial plot — downtown Hargeisa (title reviewed)",
    category: "Real Estate & Land",
    price: "$42,500",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    id: "m2",
    title: "Brand-new excavator rental with operator (weekly packages)",
    category: "Construction Equipment",
    price: "From $1,850 / week",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  },
  {
    id: "m3",
    title: "ISO-style document templates for NGO procurement files",
    category: "Professional Services",
    price: "$120",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    id: "m4",
    title: "Cold-chain refrigerated truck — 12T capacity",
    category: "Vehicles & Logistics",
    price: "$63,000",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  },
  {
    id: "m5",
    title: "Bulk office furniture — tender surplus (desks, chairs, cabinets)",
    category: "Office & Supplies",
    price: "$8,900 lot",
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  },
  {
    id: "m6",
    title: "Maritime safety equipment bundle (PPE, harnesses, radios)",
    category: "Industrial & Safety",
    price: "$4,200",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
  },
];

export const mockBlogs: BlogPost[] = [
  {
    id: "b1",
    title: "Somalia’s 2026 public procurement priorities: what suppliers should watch",
    excerpt:
      "Key ministries are consolidating RFQs into shorter cycles with stricter disclosure windows.",
    category: "Procurement Policy",
    author: "Somali Procurement Portal",
    date: "Apr 12, 2026",
  },
  {
    id: "b2",
    title: "How to pre-qualify faster for NGO framework agreements",
    excerpt:
      "Documentation checklists that cut review time for international and local vendors alike.",
    category: "Suppliers",
    author: "Editorial Desk",
    date: "Apr 08, 2026",
  },
  {
    id: "b3",
    title: "Marketplace spotlight: logistics partners winning port-to-warehouse routes",
    excerpt:
      "Regional carriers are bidding together on multi-stop routes across Bosaso–Garowe–Galkacyo.",
    category: "Logistics",
    author: "Market Intelligence",
    date: "Apr 04, 2026",
  },
  {
    id: "b4",
    title: "Green procurement: solar + storage pilots in health supply chains",
    excerpt:
      "Hybrid kits are replacing diesel generators for vaccine cold rooms in three federal hospitals.",
    category: "Sustainability",
    author: "Guest Contributor",
    date: "Mar 29, 2026",
  },
  {
    id: "b5",
    title: "Digital signatures: what’s acceptable on federal tender submissions today",
    excerpt:
      "A practical guide to compliant e-sign workflows while physical attestations still matter.",
    category: "Compliance",
    author: "Legal Review",
    date: "Mar 21, 2026",
  },
  {
    id: "b6",
    title: "SME access: breaking down bid bonds and performance guarantees",
    excerpt:
      "New guarantee products from regional banks are lowering the cost of entry for smaller firms.",
    category: "Finance",
    author: "Editorial Desk",
    date: "Mar 15, 2026",
  },
];
