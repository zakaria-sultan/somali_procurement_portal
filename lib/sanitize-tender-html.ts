import DOMPurify from "isomorphic-dompurify";

/** Sanitize admin-authored HTML for tender detail (requirements + how to apply). */
export function sanitizeTenderHtml(html: string): string {
  return DOMPurify.sanitize(html.trim(), {
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

/** True if sanitized HTML has visible text (not just empty tags). */
export function tenderHtmlIsMeaningful(html: string): boolean {
  const clean = sanitizeTenderHtml(html).replace(/<[^>]*>/g, "").trim();
  return clean.length > 0;
}
