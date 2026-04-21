import { PrismaClient } from "@prisma/client";

import { joinBlogParagraphs } from "../lib/db-map";
import { mockBlogs, mockMarketplace, mockTenders } from "../lib/mock-data";
import {
  buildBlogDetail,
  buildMarketplaceDetail,
  buildTenderDetail,
} from "../lib/mock-details";

const prisma = new PrismaClient();

function postedDateFromLabel(label: string): Date {
  const l = label.toLowerCase();
  const now = new Date();
  if (l.includes("today")) return now;
  if (l.includes("yesterday")) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d;
  }
  const t = Date.parse(label);
  if (!Number.isNaN(t)) return new Date(t);
  return now;
}

function expiryFromDetail(label: string): Date {
  const t = Date.parse(label);
  if (!Number.isNaN(t)) return new Date(t);
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

async function main() {
  await prisma.tender.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.blog.deleteMany();

  for (const t of mockTenders) {
    const d = buildTenderDetail(t.id);
    if (!d) continue;
    await prisma.tender.create({
      data: {
        title: d.title,
        organization: d.organization,
        category: d.category,
        location: d.location,
        postedDate: postedDateFromLabel(t.dateLabel),
        expiryDate: expiryFromDetail(d.expiryLabel),
        description: d.description,
        organizationBlurb: d.organizationBlurb,
        documents: d.documents,
        detailRows: [],
        requirements: d.requirements,
        contact: d.contact,
        organizationLogoUrl: null,
      },
    });
  }

  for (const m of mockMarketplace) {
    const d = buildMarketplaceDetail(m.id);
    if (!d) continue;
    await prisma.marketplaceListing.create({
      data: {
        title: d.title,
        price: d.price,
        category: d.category,
        imageUrl: d.imageUrl,
        description: d.description,
        seller: d.seller,
        highlights: d.highlights,
        contact: d.contact,
      },
    });
  }

  for (const b of mockBlogs) {
    const d = buildBlogDetail(b.id);
    if (!d) continue;
    await prisma.blog.create({
      data: {
        title: d.title,
        content: joinBlogParagraphs(d.paragraphs),
        imageUrl: null,
        author: d.author,
        category: d.category,
        createdAt: postedDateFromLabel(b.date),
      },
    });
  }

  console.log("Seed completed: tenders, marketplace, blogs.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
