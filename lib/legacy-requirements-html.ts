import type { TenderRequirementRow } from "@/lib/types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Seed TipTap when migrating from legacy single-block requirement rows. */
export function legacyRequirementsToHtml(rows: TenderRequirementRow[]): string {
  const chunks: string[] = [];
  for (const r of rows) {
    const desc = r.description.trim();
    if (!desc) continue;
    chunks.push(`<p>${escapeHtml(desc)}</p>`);
  }
  return chunks.join("");
}
