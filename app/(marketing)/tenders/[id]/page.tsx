import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getRelatedTenders,
  getTenderDetail,
} from "@/app/actions/data";
import { ContactPartySection } from "@/components/detail/contact-party-section";
import { DetailActions } from "@/components/detail/detail-actions";
import { RelatedSection } from "@/components/detail/related-section";
import { TenderDocumentList } from "@/components/detail/tender-document-list";
import { TenderMetaSidebar } from "@/components/detail/tender-meta-sidebar";
import { TenderGridCard } from "@/components/marketing/tender-grid-card";
import { tenderCategoryBadgeClassName } from "@/lib/tender-category-badge";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tender = await getTenderDetail(id);
  if (!tender) return { title: "Tender" };
  return {
    title: tender.title.slice(0, 72),
    description: tender.description.slice(0, 160),
  };
}

export default async function TenderDetailPage({ params }: Props) {
  const { id } = await params;
  const tender = await getTenderDetail(id);
  if (!tender) notFound();

  const related = await getRelatedTenders(tender.id, tender.category, 3);
  const path = `/tenders/${tender.id}`;

  const initials = tender.organization
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const logoUrl = tender.organizationLogoUrl;

  return (
    <div className="bg-background print:bg-white">
      <article className="mx-auto max-w-6xl px-4 py-8 print:text-black sm:px-6 lg:px-8">
        <div className="mb-6 print:hidden">
          <Link
            href="/tenders"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            ← Back to tenders
          </Link>
        </div>

        <header className="border-b border-border pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-sm font-bold uppercase text-muted-foreground">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="size-full object-contain p-1"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    tenderCategoryBadgeClassName(tender.category)
                  )}
                >
                  {tender.category}
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {tender.title}
              </h1>
              <p className="text-base font-semibold text-primary">{tender.organization}</p>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {tender.organizationBlurb}
              </p>
              <DetailActions path={path} title={tender.title} />
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-10">
            <section>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Tender description
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {tender.description}
              </p>
            </section>

            {tender.requirements.length > 0 ? (
              <section>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Requirements
                </h2>
                <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="bg-muted/70 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {tender.requirements.map((r, idx) => (
                        <tr key={`${r.item}-${idx}`}>
                          <td className="px-4 py-3 font-medium">{r.item}</td>
                          <td className="whitespace-pre-wrap px-4 py-3 text-muted-foreground">
                            {r.description}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {r.unit}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {r.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Documents
              </h2>
              <TenderDocumentList documents={tender.documents} />
            </section>
          </div>

          <aside className="min-w-0 space-y-4 lg:max-w-none">
            <TenderMetaSidebar
              postedLabel={tender.dateLabel}
              expiryLabel={tender.expiryLabel}
              location={tender.location}
            />
            <ContactPartySection
              role="buyer"
              listingTitle={tender.title}
              organization={tender.organization}
              contact={tender.contact}
            />
          </aside>
        </div>
      </article>

      <RelatedSection title="Related tenders">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {related.map((t) => (
            <TenderGridCard key={t.id} tender={t} />
          ))}
        </div>
      </RelatedSection>
    </div>
  );
}
