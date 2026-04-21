import Link from "next/link";

import { assertAdmin } from "@/app/actions/admin-guard";
import { signOutAction } from "@/app/actions/sign-out";
import { Button, buttonVariants } from "@/components/ui/button";
import { ADMIN_EMAIL } from "@/lib/auth-constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await assertAdmin();
  const isSuperAdmin =
    session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <span className="text-sm font-semibold text-brand-navy dark:text-white">
            SPP Admin
          </span>
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
            {isSuperAdmin ? (
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
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}
