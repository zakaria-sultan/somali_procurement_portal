import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getMarketplaceDetail,
  getRelatedMarketplace,
} from "@/app/actions/data";
import { ContactPartySection } from "@/components/detail/contact-party-section";
import { DetailActions } from "@/components/detail/detail-actions";
import { RelatedSection } from "@/components/detail/related-section";
import { MarketplaceGridCard } from "@/components/marketing/marketplace-grid-card";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getMarketplaceDetail(id);
  if (!item) return { title: "Listing" };
  return {
    title: item.title.slice(0, 72),
    description: item.description.slice(0, 160),
  };
}

export default async function MarketplaceDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getMarketplaceDetail(id);
  if (!item) notFound();

  const related = await getRelatedMarketplace(item.id, item.category, 3);
  const path = `/marketplace/${item.id}`;

  return (
    <div className="bg-background print:bg-white">
      <article className="mx-auto max-w-6xl px-4 py-8 print:text-black sm:px-6 lg:px-8">
        <div className="mb-6 print:hidden">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            ← Back to marketplace
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 66vw"
                priority
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {item.category}
                <span className="text-foreground/40"> · </span>
                <span className="font-semibold text-foreground">{item.price}</span>
              </p>
              <h1 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {item.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sold by{" "}
                <span className="font-medium text-foreground">{item.seller}</span>
              </p>
            </div>
            <DetailActions path={path} title={item.title} />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p>{item.description}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="gap-0 p-4">
              <h2 className="text-sm font-semibold text-foreground">Listing details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Category</dt>
                  <dd className="font-medium text-foreground">{item.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Price</dt>
                  <dd className="font-medium text-foreground">{item.price}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Seller</dt>
                  <dd className="font-medium text-foreground">{item.seller}</dd>
                </div>
              </dl>
            </Card>
            <ContactPartySection
              role="seller"
              listingTitle={item.title}
              organization={item.seller}
              contact={item.contact}
            />
          </aside>
        </div>
      </article>

      <RelatedSection title="Similar listings">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((m) => (
            <MarketplaceGridCard key={m.id} item={m} />
          ))}
        </div>
      </RelatedSection>
    </div>
  );
}
