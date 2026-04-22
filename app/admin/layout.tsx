import Image from "next/image";
import Link from "next/link";

import { assertAdmin } from "@/app/actions/admin-guard";
import { LOGO_MARK } from "@/components/brand/logo-mark";
import { signOutAction } from "@/app/actions/sign-out";
import { Button, buttonVariants } from "@/components/ui/button";
import { isUserManager } from "@/lib/roles";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await assertAdmin();
  const showUsers = isUserManager(session.user.role);

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link
            href="/admin"
            className="group flex items-center gap-3 rounded-xl py-1 pr-2 outline-none ring-brand-cyan/40 transition hover:bg-muted/80 focus-visible:ring-2"
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-cyan/25 bg-gradient-to-br from-brand-navy/10 to-brand-cyan/15 shadow-sm dark:from-brand-navy/40 dark:to-brand-cyan/20">
              <Image
                src={LOGO_MARK}
                alt=""
                unoptimized
                className="size-8 object-contain"
              />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="font-heading text-sm font-bold tracking-tight text-brand-navy dark:text-white">
                SPP Admin
              </span>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground/80">
                Dashboard
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground">
            <Link href="/admin" className="hover:text-brand-cyan">
              Dashboard
            </Link>
            <Link href="/admin/tenders" className="hover:text-brand-cyan">
              Tenders
            </Link>
            <Link href="/admin/marketplace" className="hover:text-brand-cyan">
              Marketplace
            </Link>
            <Link href="/admin/blogs" className="hover:text-brand-cyan">
              Blogs
            </Link>
            {showUsers ? (
              <Link href="/admin/users" className="hover:text-brand-cyan">
                Users
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "inline-flex rounded-full"
              )}
            >
              View site
            </Link>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="rounded-full"
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      {!showUsers ? (
        <div className="mx-auto max-w-6xl px-4 pt-4 md:px-8">
          <div
            className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-950 dark:text-sky-100/95"
            role="status"
          >
            <strong className="font-semibold">Users</strong> is limited to{" "}
            <strong>super admins</strong>. You can manage tenders, marketplace,
            and blogs. Ask a super admin to grant you the{" "}
            <strong>Super admin</strong> role if you need user management.
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}
