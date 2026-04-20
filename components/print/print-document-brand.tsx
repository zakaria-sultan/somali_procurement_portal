/** Visible only in print preview — centered masthead for documents */
export function PrintDocumentBrand() {
  return (
    <div className="hidden print:mb-6 print:block print:text-center">
      <p className="print:text-sm print:font-bold print:text-black">
        Somali Procurement Portal
      </p>
      <p className="print:text-[10px] print:text-neutral-700">
        somaliprocurementportal.com
      </p>
    </div>
  );
}
