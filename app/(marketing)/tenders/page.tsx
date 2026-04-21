import Link from "next/link";
import { Suspense } from "react";

import { getTenderFilterOptions, getTenders } from "@/app/actions/data";
import { TenderListCard } from "@/components/marketing/tender-list-card";
import { TendersExploreClient } from "@/components/marketing/tenders-explore-client";
import { tendersQueryFromRecord } from "@/lib/tenders-url-query";
import type { Metadata } from "next";
type TendersSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export const metadata: Metadata = {
  title: "Tenders",
  description: "Filter and search procurement notices across Somalia.",
};

const FALLBACK_CATEGORIES = [
  "Tenders",
  "RFQ",
  "Prequalification",
  "Framework",
  "Auction",
];

export default async function TendersPage({
  searchParams,
}: {
  searchParams: TendersSearchParams;
}) {
  const sp = await searchParams;
  const query = tendersQueryFromRecord(sp);
  const [tenders, filterOpts] = await Promise.all([
    getTenders(query),
    getTenderFilterOptions(),
  ]);

  const categoryOptions =
    filterOpts.categories.length > 0
      ? filterOpts.categories
      : [...FALLBACK_CATEGORIES];

  return (
    <div className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-brand-navy dark:text-white">
            Tenders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procurement notices from public and institutional buyers — filter by
            date, location, and category. Results update as you type.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="h-64 animate-pulse rounded-xl bg-muted/50" />
              <div className="h-96 animate-pulse rounded-xl bg-muted/50" />
            </div>
          }
        >
          <TendersExploreClient
            locations={filterOpts.locations}
            categories={categoryOptions}
          >
            <ul className="space-y-4">
              {tenders.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                  No tenders match your filters. Try{" "}
                  <Link href="/tenders" className="font-medium text-primary underline">
                    clearing filters
                  </Link>{" "}
                  or broadening your search.
                </li>
              ) : (
                tenders.map((t) => (
                  <li key={t.id} id={t.id}>
                    <TenderListCard tender={t} />
                  </li>
                ))
              )}
            </ul>
          </TendersExploreClient>
        </Suspense>
      </div>
    </div>
  );
}
