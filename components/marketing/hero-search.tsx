import { Filter, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProcurementCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories: ProcurementCategory[] = [
  "All",
  "Tenders",
  "RFQ",
  "Prequalification",
  "Framework",
  "Auction",
];

const fieldShell =
  "relative flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-border bg-background/90 px-3 py-2 dark:bg-muted/35";

const inputClassName =
  "h-9 border-0 bg-transparent px-0 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0";

export function HeroSearch() {
  return (
    <form
      action="/tenders"
      method="get"
      className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-2 text-card-foreground shadow-sm ring-1 ring-border/50 sm:p-3"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        <label className={cn(fieldShell, "lg:rounded-l-xl lg:rounded-r-none")}>
          <Search className="size-4 shrink-0 text-brand-cyan dark:text-sky-300" aria-hidden />
          <Input
            name="q"
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
          <Input
            name="location"
            placeholder="Country, region or city"
            className={inputClassName}
            aria-label="Location"
          />
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
              name="category"
              defaultValue="Tenders"
              className="h-9 w-full min-w-0 cursor-pointer bg-transparent text-sm text-foreground outline-none"
              aria-label="Filter type"
            >
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
              name="sort"
              defaultValue="newest"
              className="h-9 w-full min-w-0 cursor-pointer bg-transparent text-sm text-foreground outline-none"
              aria-label="Sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        <Button
          type="submit"
          className="h-11 shrink-0 rounded-xl px-6 lg:h-auto lg:rounded-l-none lg:rounded-r-xl"
        >
          <Search className="size-4 sm:mr-1" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  );
}
