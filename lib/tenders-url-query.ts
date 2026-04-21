import { firstParam } from "@/lib/search-params";
import type { TendersQuery } from "@/lib/types";

export function tendersQueryFromRecord(
  sp: Record<string, string | string[] | undefined>
): TendersQuery {
  const q = firstParam(sp.q);
  const location = firstParam(sp.location);
  const category = firstParam(sp.category);
  const sortRaw = firstParam(sp.sort);
  const sort = sortRaw === "oldest" ? "oldest" : "newest";
  const dateRaw = firstParam(sp.dateWindow);
  const dateWindow =
    dateRaw === "24h" || dateRaw === "3d" || dateRaw === "7d" || dateRaw === "30d"
      ? dateRaw
      : "any";

  return { q, location, category, sort, dateWindow };
}

export function tendersQueryFromURLSearchParams(sp: URLSearchParams): TendersQuery {
  const asRecord = Object.fromEntries(sp.entries());
  return tendersQueryFromRecord(asRecord);
}

export function buildTendersSearchParams(q: TendersQuery): URLSearchParams {
  const p = new URLSearchParams();
  const kw = q.q?.trim();
  const loc = q.location?.trim();
  const cat = q.category?.trim();
  if (kw) p.set("q", kw);
  if (loc) p.set("location", loc);
  if (cat && cat !== "All") p.set("category", cat);
  p.set("sort", q.sort ?? "newest");
  p.set("dateWindow", q.dateWindow ?? "any");
  return p;
}
