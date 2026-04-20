"use server";

import { mockBlogs, mockMarketplace, mockTenders } from "@/lib/mock-data";
import {
  buildBlogDetail,
  buildMarketplaceDetail,
  buildTenderDetail,
} from "@/lib/mock-details";
import type {
  BlogDetail,
  BlogPost,
  MarketplaceDetail,
  MarketplaceItem,
  Tender,
  TenderDetail,
  TendersQuery,
} from "@/lib/types";

function matchesDateWindow(dateLabel: string, window: TendersQuery["dateWindow"]) {
  if (!window || window === "any") return true;
  const lower = dateLabel.toLowerCase();
  if (window === "24h") return lower.includes("today");
  if (window === "3d") return lower.includes("today") || lower.includes("yesterday");
  if (window === "7d")
    return (
      lower.includes("today") ||
      lower.includes("yesterday") ||
      lower.includes("apr 17") ||
      lower.includes("apr 16")
    );
  return true;
}

export async function getTenders(query: TendersQuery = {}): Promise<Tender[]> {
  const q = query.q?.trim().toLowerCase() ?? "";
  const loc = query.location?.trim().toLowerCase() ?? "";
  const category = query.category?.trim() ?? "";
  const sort = query.sort ?? "newest";
  const dateWindow = query.dateWindow ?? "any";

  let list = [...mockTenders];

  if (q) {
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.organization.toLowerCase().includes(q)
    );
  }
  if (loc) {
    list = list.filter((t) => t.location.toLowerCase().includes(loc));
  }
  if (category && category !== "All") {
    list = list.filter((t) => t.category === category);
  }
  list = list.filter((t) => matchesDateWindow(t.dateLabel, dateWindow));

  if (sort === "oldest") {
    list = [...list].reverse();
  }

  return list;
}

export async function getFeaturedTenders(limit = 4): Promise<Tender[]> {
  return mockTenders.slice(0, limit);
}

export async function getMarketplaceHighlights(limit = 3): Promise<MarketplaceItem[]> {
  return mockMarketplace.slice(0, limit);
}

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  return mockMarketplace;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return mockBlogs;
}

export async function getTenderDetail(id: string): Promise<TenderDetail | null> {
  return buildTenderDetail(id);
}

export async function getRelatedTenders(
  id: string,
  category: string,
  limit = 3
): Promise<Tender[]> {
  const same = mockTenders.filter((t) => t.id !== id && t.category === category);
  const other = mockTenders.filter((t) => t.id !== id && t.category !== category);
  return [...same, ...other].slice(0, limit);
}

export async function getMarketplaceDetail(id: string): Promise<MarketplaceDetail | null> {
  return buildMarketplaceDetail(id);
}

export async function getRelatedMarketplace(
  id: string,
  category: string,
  limit = 3
): Promise<MarketplaceItem[]> {
  const same = mockMarketplace.filter(
    (m) => m.id !== id && m.category === category
  );
  const other = mockMarketplace.filter(
    (m) => m.id !== id && m.category !== category
  );
  return [...same, ...other].slice(0, limit);
}

export async function getBlogDetail(id: string): Promise<BlogDetail | null> {
  return buildBlogDetail(id);
}

export async function getRelatedBlogs(
  id: string,
  category: string,
  limit = 3
): Promise<BlogPost[]> {
  const same = mockBlogs.filter((b) => b.id !== id && b.category === category);
  const other = mockBlogs.filter((b) => b.id !== id && b.category !== category);
  return [...same, ...other].slice(0, limit);
}
