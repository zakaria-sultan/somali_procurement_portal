import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Tender } from "@/lib/types";
import { tenderCategoryBadgeClassName } from "@/lib/tender-category-badge";
import { cn } from "@/lib/utils";

export function TenderGridCard({
  tender,
  className,
}: {
  tender: Tender;
  className?: string;
}) {
  const initials = tender.organization
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const logo = tender.organizationLogoUrl;

  return (
    <Card
      className={cn(
        "hover:shadow-md hover:ring-brand-cyan/20",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="mr-4 flex size-12 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg border border-border/60 bg-muted text-[0.65rem] font-bold uppercase text-muted-foreground">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              className="size-full object-contain p-0.5"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2 py-0.5">
          <Link
            href={`/tenders/${tender.id}`}
            className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground hover:text-brand-cyan"
          >
            {tender.title}
          </Link>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {tender.organization}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0 text-[0.65rem] font-semibold",
                tenderCategoryBadgeClassName(tender.category)
              )}
            >
              {tender.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
              <CalendarDays className="size-3" aria-hidden />
              {tender.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              {tender.location}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
