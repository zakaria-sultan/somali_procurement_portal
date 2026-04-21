"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, UserRound } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserAccountMenu } from "@/components/layout/user-account-menu";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/lib/nav";
import { isContentAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative px-1 py-2 text-sm font-medium text-foreground/85 transition-colors hover:text-foreground",
        active && "text-foreground"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-brand-cyan transition-opacity",
          active ? "opacity-100" : "opacity-0 hover:opacity-40"
        )}
      />
    </Link>
  );
}

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 print:hidden backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="mx-auto flex min-h-[4.25rem] max-w-6xl items-center gap-4 px-4 py-3 md:px-8">
        <div className="flex flex-1 items-center gap-3">
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "md:hidden"
              )}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="sr-only">Main menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-1">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                {session?.user?.email ? (
                  <>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <UserRound className="size-4" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </>
                ) : null}
                {isContentAdmin(session?.user?.role) ? (
                  <Link
                    href="/admin"
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-cyan hover:bg-muted"
                  >
                    Admin dashboard
                  </Link>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
          <Logo className="min-w-0" />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-x-8 gap-y-1 lg:flex">
          {mainNav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-4 flex flex-1 items-center justify-end gap-3 sm:ml-6 sm:gap-4">
          <ThemeToggle />
          {isContentAdmin(session?.user?.role) ? (
            <Link
              href="/admin"
              className="hidden text-sm font-semibold text-brand-cyan hover:underline sm:inline"
            >
              Admin
            </Link>
          ) : null}
          <UserAccountMenu />
        </div>
      </div>
    </header>
  );
}
