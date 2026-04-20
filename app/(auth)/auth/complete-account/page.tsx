import Link from "next/link";
import { redirect } from "next/navigation";

import { CompleteAccountForm } from "@/components/auth/complete-account-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signupEmailSchema } from "@/lib/schemas/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete your account",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function CompleteAccountPage({ searchParams }: Props) {
  const { email: rawEmail } = await searchParams;
  if (!rawEmail) {
    redirect("/auth/signup");
  }

  const decoded = decodeURIComponent(rawEmail);
  const parsed = signupEmailSchema.safeParse({ email: decoded });
  if (!parsed.success) {
    redirect("/auth/signup");
  }

  const email = parsed.data.email;

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-left">
        <Link
          href="/auth/signup"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back
        </Link>
        <CardTitle className="text-xl">Complete your Account</CardTitle>
        <CardDescription>You&apos;re almost there!</CardDescription>
      </CardHeader>
      <CardContent>
        <CompleteAccountForm email={email} />
      </CardContent>
    </Card>
  );
}
