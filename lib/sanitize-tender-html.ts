import sanitizeHtml from "sanitize-html";

/**
 * Sanitize admin-authored HTML for tender detail (description, requirements, how to apply).
 * Uses `sanitize-html` (no jsdom) so Vercel SSR/Node never loads `isomorphic-dompurify` / jsdom
 * (those hit ERR_REQUIRE_ESM with Turbopack).
 */
export function sanitizeTenderHtml(html: string): string {
  return sanitizeHtml(html.trim(), {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}

/** True if sanitized HTML has visible text (not just empty tags). */
export function tenderHtmlIsMeaningful(html: string): boolean {
  const clean = sanitizeTenderHtml(html).replace(/<[^>]*>/g, "").trim();
  return clean.length > 0;
}

/** Plain text for search / meta — input should already be sanitized tender HTML. */
export function plainTextFromTenderHtml(html: string): string {
  return html
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
