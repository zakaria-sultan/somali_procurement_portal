"use server";

import {
  mapBlogDetail,
  mapBlogList,
  mapMarketplaceDetail,
  mapMarketplaceList,
  mapTenderDetail,
  mapTenderList,
} from "@/lib/db-map";
import prisma from "@/lib/prisma";
import type {
  BlogDetail,
  BlogPost,
  MarketplaceDetail,
  MarketplaceItem,
  Tender,
  TenderDetail,
  TendersQuery,
} from "@/lib/types";

function postedDateFilter(window: TendersQuery["dateWindow"]) {
  if (!window || window === "any") return {};
  const now = new Date();
  const days: Record<string, number> = {
    "24h": 1,
    "3d": 3,
    "7d": 7,
    "30d": 30,
  };
  const n = days[window];
  if (!n) return {};
  const since = new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  return { postedDate: { gte: since } };
}

export async function getTenders(query: TendersQuery = {}): Promise<Tender[]> {
  const q = query.q?.trim() ?? "";
  const loc = query.location?.trim() ?? "";
  const category = query.category?.trim() ?? "";
  const sort = query.sort ?? "newest";
  const dateWindow = query.dateWindow ?? "any";

  const where = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { organization: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      loc ? { location: { contains: loc, mode: "insensitive" as const } } : {},
      category && category !== "All" ? { category } : {},
      postedDateFilter(dateWindow),
    ],
  };

  const rows = await prisma.tender.findMany({
    where,
    orderBy: { postedDate: sort === "oldest" ? "asc" : "desc" },
  });

  return rows.map(mapTenderList);
}

export async function getFeaturedTenders(limit = 4): Promise<Tender[]> {
  const rows = await prisma.tender.findMany({
    orderBy: { postedDate: "desc" },
    take: limit,
  });
  return rows.map(mapTenderList);
}

export async function getMarketplaceHighlights(
  limit = 3
): Promise<MarketplaceItem[]> {
  const rows = await prisma.marketplaceListing.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapMarketplaceList);
}

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  const rows = await prisma.marketplaceListing.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapMarketplaceList);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapBlogList);
}

export async function getTenderDetail(id: string): Promise<TenderDetail | null> {
  const row = await prisma.tender.findUnique({ where: { id } });
  if (!row) return null;
  return mapTenderDetail(row);
}

export async function getRelatedTenders(
  id: string,
  category: string,
  limit = 3
): Promise<Tender[]> {
  const rows = await prisma.tender.findMany({
    where: {
      id: { not: id },
      category,
    },
    orderBy: { postedDate: "desc" },
    take: limit,
  });
  if (rows.length >= limit) return rows.map(mapTenderList);

  const more = await prisma.tender.findMany({
    where: {
      id: { not: id },
      NOT: { category },
    },
    orderBy: { postedDate: "desc" },
    take: limit - rows.length,
  });
  return [...rows, ...more].map(mapTenderList);
}

export async function getMarketplaceDetail(
  id: string
): Promise<MarketplaceDetail | null> {
  const row = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!row) return null;
  return mapMarketplaceDetail(row);
}

export async function getRelatedMarketplace(
  id: string,
  category: string,
  limit = 3
): Promise<MarketplaceItem[]> {
  const rows = await prisma.marketplaceListing.findMany({
    where: { id: { not: id }, category },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (rows.length >= limit) return rows.map(mapMarketplaceList);

  const more = await prisma.marketplaceListing.findMany({
    where: { id: { not: id }, NOT: { category } },
    orderBy: { createdAt: "desc" },
    take: limit - rows.length,
  });
  return [...rows, ...more].map(mapMarketplaceList);
}

export async function getBlogDetail(id: string): Promise<BlogDetail | null> {
  const row = await prisma.blog.findUnique({ where: { id } });
  if (!row) return null;
  return mapBlogDetail(row);
}

export async function getRelatedBlogs(
  id: string,
  category: string,
  limit = 3
): Promise<BlogPost[]> {
  const rows = await prisma.blog.findMany({
    where: { id: { not: id }, category },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (rows.length >= limit) return rows.map(mapBlogList);

  const more = await prisma.blog.findMany({
    where: { id: { not: id }, NOT: { category } },
    orderBy: { createdAt: "desc" },
    take: limit - rows.length,
  });
  return [...rows, ...more].map(mapBlogList);
}
