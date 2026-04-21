import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isContentAdmin, roleDisplayLabel } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  const u = session.user;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Your profile</CardTitle>
          <CardDescription>
            Signed in as {u.email ?? "this account"}. You can review your
            details here or sign out from the menu in the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {u.name ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {u.email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {roleDisplayLabel(u.role)}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className={cn(buttonVariants(), "rounded-full")}>
              Back to home
            </Link>
            {isContentAdmin(u.role) ? (
              <Link
                href="/admin"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full"
                )}
              >
                Admin dashboard
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
