import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroSearch } from "@/components/marketing/hero-search";
import { MarketplaceGridCard } from "@/components/marketing/marketplace-grid-card";
import { TenderGridCard } from "@/components/marketing/tender-grid-card";
import { Button } from "@/components/ui/button";
import { getFeaturedTenders, getMarketplaceHighlights } from "@/app/actions/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Search procurement notices, explore tenders, and discover marketplace listings across Somalia.",
};

export default async function HomePage() {
  const [featured, marketplace] = await Promise.all([
    getFeaturedTenders(4),
    getMarketplaceHighlights(3),
  ]);

  return (
    <div className="bg-background">
      <section className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-brand-navy dark:text-white sm:text-4xl">
              Procurement notices{" "}
              <span className="text-brand-cyan">built for Somali</span> buyers &
              suppliers
            </h1>
            <p className="mt-3 text-base text-brand-navy/90 dark:text-slate-300 sm:text-lg">
              Search{" "}
              <span className="font-semibold text-brand-cyan">tenders</span>,{" "}
              <span className="font-semibold text-brand-cyan">RFQs</span>, and
              prequalifications — plus{" "}
              <span className="font-semibold text-brand-cyan">marketplace</span>{" "}
              highlights from verified sellers.
            </p>
          </div>
          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Featured tenders
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent procurement activity from federal, NGO, and private buyers.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/tenders" />}
            variant="outline"
            className="rounded-full gap-1.5"
          >
            View all tenders
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featured.map((t) => (
            <TenderGridCard key={t.id} tender={t} />
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                Marketplace highlights
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Equipment, real estate, and services from the SPP marketplace.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/marketplace" />}
              variant="outline"
              className="rounded-full gap-1.5"
            >
              Explore marketplace
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {marketplace.map((item) => (
              <MarketplaceGridCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand-navy px-6 py-10 text-center text-white sm:px-10">
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">
            List your opportunity or storefront
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
            Vendor onboarding and verified listings will connect to your account
            once authentication is enabled.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/contact" />}
            className="mt-6 rounded-full bg-brand-cyan text-primary-foreground hover:bg-brand-cyan/90"
          >
            Contact the team
          </Button>
        </div>
      </section>
    </div>
  );
}
