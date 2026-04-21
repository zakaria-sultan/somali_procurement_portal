import Link from "next/link";
import { ArrowRight, FileText, Newspaper, Store } from "lucide-react";

import prisma from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminHomePage() {
  const [tenders, listings, blogs] = await Promise.all([
    prisma.tender.count(),
    prisma.marketplaceListing.count(),
    prisma.blog.count(),
  ]);

  const total = tenders + listings + blogs;

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-navy via-brand-navy to-brand-cyan/90 px-6 py-10 text-white shadow-lg sm:px-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-brand-cyan/30 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Control center
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            Manage tenders, marketplace listings, and blog posts. Content is
            stored in PostgreSQL; uploads use Vercel Blob where configured.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1 font-medium backdrop-blur-sm">
              {total} total records
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
              {tenders} tenders · {listings} listings · {blogs} articles
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Content hubs
        </h2>
        <p className="text-sm text-muted-foreground">
          Each area has its own tools — open the section you need.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="group relative overflow-hidden border-brand-cyan/25 shadow-md transition-shadow hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-cyan to-sky-400" />
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-cyan/15 text-brand-cyan">
                <FileText className="size-5" aria-hidden />
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {tenders} live
              </span>
            </div>
            <CardTitle className="text-lg">Tenders</CardTitle>
            <CardDescription>
              Procurement notices, documents, buyer contacts, and requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/tenders"
              className={cn(
                buttonVariants(),
                "inline-flex w-full rounded-xl gap-2 transition-transform group-hover:translate-x-0.5"
              )}
            >
              Manage tenders
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-emerald-500/25 shadow-md transition-shadow hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <Store className="size-5" aria-hidden />
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {listings} live
              </span>
            </div>
            <CardTitle className="text-lg">Marketplace</CardTitle>
            <CardDescription>
              Seller listings, pricing, imagery, and marketplace highlights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/marketplace"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "inline-flex w-full rounded-xl gap-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 hover:bg-emerald-500/20 dark:text-emerald-100 dark:hover:bg-emerald-500/15"
              )}
            >
              Manage marketplace
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-violet-500/25 shadow-md transition-shadow hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-400" />
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 dark:text-violet-300">
                <Newspaper className="size-5" aria-hidden />
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {blogs} live
              </span>
            </div>
            <CardTitle className="text-lg">Blogs</CardTitle>
            <CardDescription>
              News and guidance articles shown on the public blog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/blogs"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex w-full rounded-xl gap-2 border-violet-500/35 hover:bg-violet-500/10"
              )}
            >
              Manage articles
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
