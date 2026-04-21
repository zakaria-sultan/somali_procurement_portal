"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, LogOut, Shield, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isContentAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";

function initials(name: string | null | undefined, email: string | null | undefined) {
  const n = (name ?? "").trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const e = (email ?? "").trim();
  if (e) return e.slice(0, 2).toUpperCase();
  return "?";
}

export function UserAccountMenu({ className }: { className?: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div
        className={cn(
          "h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted",
          className
        )}
        aria-hidden
      />
    );
  }

  if (!user?.email) {
    return (
      <Link
        href="/auth/signin"
        className={cn(
          buttonVariants({ size: "default" }),
          "rounded-full border border-brand-navy/20 bg-brand-navy px-4 text-white shadow-sm hover:bg-brand-navy/90 hover:text-white",
          className
        )}
      >
        <UserRound className="size-4" />
        Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-10 gap-2 rounded-full border-border px-2 pr-3 shadow-sm",
          className
        )}
      >
        <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-brand-navy/10">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs font-semibold text-brand-navy">
              {initials(user.name, user.email)}
            </span>
          )}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline">
          {user.name ?? user.email}
        </span>
        <ChevronDown className="size-4 opacity-60" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="truncate text-sm font-medium">
                {user.name ?? "Your account"}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/account")}>
            <UserRound className="size-4" />
            Profile
          </DropdownMenuItem>
          {isContentAdmin(user.role) ? (
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Shield className="size-4" />
              Admin dashboard
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
