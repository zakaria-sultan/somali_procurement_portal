import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PrintDocumentBrand } from "@/components/print/print-document-brand";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PrintDocumentBrand />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
