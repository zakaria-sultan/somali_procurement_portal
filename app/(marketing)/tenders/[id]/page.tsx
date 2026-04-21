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
import {
  sanitizeTenderHtml,
  tenderHtmlIsMeaningful,
} from "@/lib/sanitize-tender-html";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const tenderProseClass =
  "tender-prose mt-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-3 [&_h3]:font-heading [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6";

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

  const requirementsHtmlSafe = sanitizeTenderHtml(tender.requirementsHtml ?? "");
  const showRequirementsRich = tenderHtmlIsMeaningful(tender.requirementsHtml ?? "");
  const showRequirementsLegacy =
    !showRequirementsRich && tender.requirements.length > 0;
  const howToHtmlSafe = sanitizeTenderHtml(tender.howToApply ?? "");
  const showHowTo = tenderHtmlIsMeaningful(tender.howToApply ?? "");

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

            {showHowTo ? (
              <section
                className="rounded-2xl border-2 border-sky-500/25 bg-gradient-to-br from-sky-50/90 to-card p-6 dark:from-brand-navy/40 dark:to-card print:border print:border-border print:bg-card"
                aria-labelledby="how-to-apply-heading"
              >
                <h2
                  id="how-to-apply-heading"
                  className="font-heading text-lg font-semibold text-brand-navy dark:text-foreground"
                >
                  How to apply
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow these steps to submit a compliant bid or expression of interest.
                </p>
                <div
                  className={tenderProseClass}
                  dangerouslySetInnerHTML={{ __html: howToHtmlSafe }}
                />
              </section>
            ) : null}

            {showRequirementsRich ? (
              <section>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Requirements
                </h2>
                <div
                  className={tenderProseClass}
                  dangerouslySetInnerHTML={{ __html: requirementsHtmlSafe }}
                />
              </section>
            ) : null}

            {showRequirementsLegacy ? (
              <section>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Requirements
                </h2>
                <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="bg-muted/70 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Unit</th>
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
