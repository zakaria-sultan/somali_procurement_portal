"use client";

import { useRouter } from "next/navigation";
import { Filter, MapPin, Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { buildTendersSearchParams } from "@/lib/tenders-url-query";
import type { TendersQuery } from "@/lib/types";
import { cn } from "@/lib/utils";

const fieldShell =
  "relative flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-border bg-background/90 px-3 py-2 dark:bg-muted/35";

const inputClassName =
  "h-9 border-0 bg-transparent px-0 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0";

export function HeroSearchClient({
  locations,
  categories,
}: {
  locations: string[];
  categories: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Tenders");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const qTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const push = useCallback(
    (patch: Partial<TendersQuery>) => {
      const next: TendersQuery = {
        q: q || undefined,
        location: location || undefined,
        category: category || "All",
        sort,
        dateWindow: "any",
        ...patch,
      };
      const p = buildTendersSearchParams(next);
      const qs = p.toString();
      router.push(qs ? `/tenders?${qs}` : "/tenders");
    },
    [router, q, location, category, sort]
  );

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-2 text-card-foreground shadow-sm ring-1 ring-border/50 sm:p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        <label className={cn(fieldShell, "lg:rounded-l-xl lg:rounded-r-none")}>
          <Search className="size-4 shrink-0 text-brand-cyan dark:text-sky-300" aria-hidden />
          <Input
            value={q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              if (qTimer.current) clearTimeout(qTimer.current);
              qTimer.current = setTimeout(() => {
                const next: TendersQuery = {
                  q: v || undefined,
                  location: location || undefined,
                  category,
                  sort,
                  dateWindow: "any",
                };
                const p = buildTendersSearchParams(next);
                const qs = p.toString();
                router.push(qs ? `/tenders?${qs}` : "/tenders");
              }, 400);
            }}
            placeholder="Keywords — title, organization, scope…"
            className={inputClassName}
            aria-label="Search keywords"
          />
        </label>
        <label
          className={cn(
            fieldShell,
            "lg:rounded-none lg:border-x lg:border-border"
          )}
        >
          <MapPin className="size-4 shrink-0 text-brand-cyan dark:text-sky-300" aria-hidden />
          <select
            className={cn(inputClassName, "w-full cursor-pointer")}
            value={location}
            onChange={(e) => {
              const v = e.target.value;
              setLocation(v);
              push({ location: v || undefined });
            }}
            aria-label="Location"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row lg:contents">
          <div
            className={cn(
              fieldShell,
              "lg:w-44 lg:flex-none lg:rounded-none lg:border-x-0"
            )}
          >
            <Filter
              className="mr-2 size-4 shrink-0 text-brand-cyan dark:text-sky-300 lg:hidden"
              aria-hidden
            />
            <select
              className={cn(inputClassName, "w-full cursor-pointer")}
              value={category}
              onChange={(e) => {
                const v = e.target.value;
                setCategory(v);
                push({ category: v });
              }}
              aria-label="Filter type"
            >
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div
            className={cn(
              fieldShell,
              "lg:w-36 lg:flex-none lg:rounded-l-none lg:rounded-r-xl"
            )}
          >
            <select
              className={cn(inputClassName, "w-full cursor-pointer")}
              value={sort}
              onChange={(e) => {
                const v = e.target.value === "oldest" ? "oldest" : "newest";
                setSort(v);
                push({ sort: v });
              }}
              aria-label="Sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Results update as you type or change filters.
      </p>
    </div>
  );
}
