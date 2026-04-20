import { CalendarDays, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";

export function TenderMetaSidebar({
  postedLabel,
  expiryLabel,
  location,
}: {
  postedLabel: string;
  expiryLabel: string;
  location: string;
}) {
  return (
    <Card className="sticky top-24 gap-0 overflow-hidden p-0 shadow-sm">
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Tender details</h2>
      </div>
      <div className="space-y-0 divide-y divide-border p-2">
        <div className="flex gap-3 rounded-lg px-3 py-3">
          <CalendarDays className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">{postedLabel}</p>
            <p className="text-xs text-muted-foreground">Posted date</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg px-3 py-3">
          <CalendarDays className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">{expiryLabel}</p>
            <p className="text-xs text-muted-foreground">Expire date</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg px-3 py-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">{location}</p>
            <p className="text-xs text-muted-foreground">Location</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
