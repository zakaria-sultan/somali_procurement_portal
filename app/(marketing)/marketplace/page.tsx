import { getMarketplaceItems } from "@/app/actions/data";
import { MarketplaceGridCard } from "@/components/marketing/marketplace-grid-card";
import { Input } from "@/components/ui/input";
import type { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Products and services from verified Somali sellers.",
};

export default async function MarketplacePage() {
  const items = await getMarketplaceItems();

  return (
    <div className="bg-muted/30">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-brand-navy">
            Marketplace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Explore listings for equipment, real estate, vehicles, and business
            services. Transactions will be secured through verified accounts in a
            future release.
          </p>
          <form
            className="mt-6 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2"
            action="/marketplace"
            method="get"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search the marketplace…"
              className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MarketplaceGridCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
