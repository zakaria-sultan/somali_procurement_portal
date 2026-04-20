import Link from "next/link";
import { Building2, CalendarDays, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Tender } from "@/lib/types";
import { tenderCategoryBadgeClassName } from "@/lib/tender-category-badge";
import { cn } from "@/lib/utils";

export function TenderListCard({
  tender,
  className,
}: {
  tender: Tender;
  className?: string;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        "transition-shadow hover:shadow-md hover:ring-brand-cyan/25",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="mr-4 flex size-14 shrink-0 items-center justify-center self-center rounded-lg bg-muted text-xs font-semibold uppercase text-muted-foreground">
          {tender.organization
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </div>
        <div className="min-w-0 flex-1 space-y-3 py-1">
          <div>
            <Link
              href={`/tenders/${tender.id}`}
              className="font-heading text-base font-semibold text-foreground hover:text-brand-cyan"
            >
              {tender.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {tender.organization}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                tenderCategoryBadgeClassName(tender.category)
              )}
            >
              {tender.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden />
              {tender.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              {tender.location}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              <Building2 className="size-3.5" aria-hidden />
              Buyer
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
