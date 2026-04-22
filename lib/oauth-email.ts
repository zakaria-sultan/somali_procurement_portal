/**
 * Align Google profile email with rows created via email/password signup.
 * Gmail treats dots in the local part as equivalent; Google may return a
 * different spelling than the user typed at registration.
 */
export function canonicalizeOAuthEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 1) return trimmed;
  let local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replace(/\./g, "");
  }
  return `${local}@${domain}`;
}
