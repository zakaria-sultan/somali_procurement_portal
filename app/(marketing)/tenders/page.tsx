import Link from "next/link";
import { Search } from "lucide-react";

import { getTenders } from "@/app/actions/data";
import { TenderListCard } from "@/components/marketing/tender-list-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firstParam } from "@/lib/search-params";
import type { Metadata } from "next";
import type { TendersQuery } from "@/lib/types";

type TendersSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export const metadata: Metadata = {
  title: "Tenders",
  description: "Filter and search procurement notices across Somalia.",
};

function parseQuery(sp: Record<string, string | string[] | undefined>): TendersQuery {
  const q = firstParam(sp.q);
  const location = firstParam(sp.location);
  const category = firstParam(sp.category);
  const sortRaw = firstParam(sp.sort);
  const sort = sortRaw === "oldest" ? "oldest" : "newest";
  const dateRaw = firstParam(sp.dateWindow);
  const dateWindow =
    dateRaw === "24h" || dateRaw === "3d" || dateRaw === "7d" || dateRaw === "30d"
      ? dateRaw
      : "any";

  return { q, location, category, sort, dateWindow };
}

export default async function TendersPage({
  searchParams,
}: {
  searchParams: TendersSearchParams;
}) {
  const sp = await searchParams;
  const query = parseQuery(sp);
  const tenders = await getTenders(query);

  return (
    <div className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-brand-navy">
            Tenders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procurement notices from public and institutional buyers — filter by
            date, location, and category.
          </p>
        </div>

        <form
          method="get"
          action="/tenders"
          className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]"
        >
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Filter</span>
              <Link
                href="/tenders"
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear all
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <details className="group border-b border-border last:border-b-0" open>
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  Date posted
                </summary>
                <div className="space-y-2 px-4 pb-4">
                  {(
                    [
                      ["any", "Any time"],
                      ["24h", "Last 24 hours"],
                      ["3d", "Last 3 days"],
                      ["7d", "Last 7 days"],
                      ["30d", "Last 30 days"],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="dateWindow"
                        value={value}
                        defaultChecked={query.dateWindow === value}
                        className="size-4 accent-brand-cyan"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </details>
              <details className="group border-b border-border last:border-b-0" open>
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  Location
                </summary>
                <div className="px-4 pb-4">
                  <Input
                    name="location"
                    placeholder="City or region"
                    defaultValue={query.location ?? ""}
                    className="bg-background"
                  />
                </div>
              </details>
              <div className="p-4">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                  <select
                    name="category"
                    defaultValue={query.category ?? "All"}
                    className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {[
                      "All",
                      "Tenders",
                      "RFQ",
                      "Prequalification",
                      "Framework",
                      "Auction",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <Button type="submit" className="h-10 w-full rounded-xl gap-2">
              <Search className="size-4" />
              Search
            </Button>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex min-h-10 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3">
                <Search className="size-4 text-muted-foreground" aria-hidden />
                <Input
                  name="q"
                  placeholder="Search by title, company or keywords"
                  defaultValue={query.q ?? ""}
                  className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </label>
              <div className="flex shrink-0 items-center gap-2 sm:w-44">
                <span className="text-xs text-muted-foreground">Sort</span>
                <select
                  name="sort"
                  defaultValue={query.sort ?? "newest"}
                  className="h-10 flex-1 rounded-xl border border-border bg-card px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            <ul className="space-y-4">
              {tenders.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                  No tenders match your filters. Try clearing filters or broadening
                  your search.
                </li>
              ) : (
                tenders.map((t) => (
                  <li key={t.id} id={t.id}>
                    <TenderListCard tender={t} />
                  </li>
                ))
              )}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
