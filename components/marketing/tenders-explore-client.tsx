"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  buildTendersSearchParams,
  tendersQueryFromURLSearchParams,
} from "@/lib/tenders-url-query";
import type { TendersQuery } from "@/lib/types";

export function TendersExploreClient({
  locations,
  categories,
  children,
}: {
  locations: string[];
  categories: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = useMemo(
    () => tendersQueryFromURLSearchParams(searchParams),
    [searchParams]
  );

  const [qDraft, setQDraft] = useState(query.q ?? "");
  const qTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setQDraft(query.q ?? "");
  }, [query.q]);

  const merge = useCallback(
    (patch: Partial<TendersQuery>) => {
      const next: TendersQuery = { ...query, ...patch };
      const p = buildTendersSearchParams(next);
      const qs = p.toString();
      router.replace(qs ? `/tenders?${qs}` : "/tenders", { scroll: false });
    },
    [query, router]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
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
                    checked={query.dateWindow === value}
                    onChange={() => merge({ dateWindow: value })}
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
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                value={query.location ?? ""}
                onChange={(e) =>
                  merge({
                    location: e.target.value || undefined,
                  })
                }
                aria-label="Filter by location"
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </details>
          <div className="p-4">
            <label className="text-xs font-medium text-muted-foreground">
              Category
              <select
                className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                value={query.category ?? "All"}
                onChange={(e) =>
                  merge({
                    category: e.target.value || "All",
                  })
                }
              >
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex min-h-10 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <Input
              value={qDraft}
              onChange={(e) => {
                const v = e.target.value;
                setQDraft(v);
                if (qTimer.current) clearTimeout(qTimer.current);
                qTimer.current = setTimeout(
                  () => merge({ q: v || undefined }),
                  350
                );
              }}
              placeholder="Search by title, company or keywords"
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              aria-label="Search tenders"
            />
          </label>
          <div className="flex shrink-0 items-center gap-2 sm:w-44">
            <span className="text-xs text-muted-foreground">Sort</span>
            <select
              className="h-10 flex-1 rounded-xl border border-border bg-card px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              value={query.sort ?? "newest"}
              onChange={(e) =>
                merge({
                  sort: e.target.value === "oldest" ? "oldest" : "newest",
                })
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
