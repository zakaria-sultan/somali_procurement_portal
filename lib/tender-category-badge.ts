import type { ProcurementCategory } from "@/lib/types";

export function tenderCategoryBadgeClassName(
  category: Exclude<ProcurementCategory, "All"> | string
): string {
  const c = category as Exclude<ProcurementCategory, "All">;
  switch (c) {
    case "RFQ":
      return "bg-brand-cyan text-white";
    case "Tenders":
      return "bg-brand-navy text-white";
    case "Framework":
      return "bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950";
    case "Prequalification":
      return "bg-violet-600 text-white dark:bg-violet-500 dark:text-white";
    case "Auction":
      return "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950";
    default:
      return "bg-muted text-foreground";
  }
}
