import { getTenderFilterOptions } from "@/app/actions/data";

import { HeroSearchClient } from "@/components/marketing/hero-search-client";

const FALLBACK_CATEGORIES = [
  "Tenders",
  "RFQ",
  "Prequalification",
  "Framework",
  "Auction",
] as const;

export async function HeroSearch() {
  const opts = await getTenderFilterOptions();
  const categories =
    opts.categories.length > 0 ? opts.categories : [...FALLBACK_CATEGORIES];

  return (
    <HeroSearchClient locations={opts.locations} categories={categories} />
  );
}
