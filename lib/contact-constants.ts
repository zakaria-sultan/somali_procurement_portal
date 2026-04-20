/** Public contact points — safe to import from client components */
export const SITE_CONTACT = {
  email: "info@somaliprocurementportal.com",
  phoneDisplay: "+252 63 000 0000",
  phoneTel: "+252630000000",
  whatsappDigits: "252630000000",
  addressMogadishu:
    "KM4 / Hodan district — Mogadishu liaison office (suite number coming soon)",
  addressHargeisa:
    "Central business district — Hargeisa liaison office (full street address coming soon)",
} as const;

export function whatsappUrl(text: string): string {
  const enc = encodeURIComponent(text);
  return `https://wa.me/${SITE_CONTACT.whatsappDigits}?text=${enc}`;
}
