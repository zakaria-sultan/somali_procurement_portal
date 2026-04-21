import Link from "next/link";
import { redirect } from "next/navigation";

import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isEmailTransportConfigured } from "@/lib/email/send-signup-otp";
import { registerEmailSchema } from "@/lib/schemas/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email: rawEmail } = await searchParams;
  if (!rawEmail) {
    redirect("/auth/signup");
  }

  const decoded = decodeURIComponent(rawEmail);
  const parsed = registerEmailSchema.safeParse({ email: decoded });
  if (!parsed.success) {
    redirect("/auth/signup");
  }

  const email = parsed.data.email;
  const devHint = !isEmailTransportConfigured();

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-left">
        <Link
          href="/auth/signup"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back
        </Link>
        <CardTitle className="text-xl">Check your inbox</CardTitle>
        <CardDescription>
          {devHint
            ? "We couldn’t send email from this machine, so your code was printed in the server terminal (where you ran npm run dev)."
            : "We’ve emailed a 6-digit code to confirm your Gmail address. Enter it below, then you’ll go to sign in and access the site."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyEmailForm email={email} />
      </CardContent>
    </Card>
  );
}
