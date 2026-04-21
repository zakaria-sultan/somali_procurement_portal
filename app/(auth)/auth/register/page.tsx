import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterDetailsForm } from "@/components/auth/register-details-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerEmailSchema } from "@/lib/schemas/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
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

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-left">
        <Link
          href="/auth/signup"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back
        </Link>
        <CardTitle className="text-xl">Your details</CardTitle>
        <CardDescription>
          You&apos;re registering with{" "}
          <span className="font-medium text-foreground">{email}</span>. Fill in
          the form below. We&apos;ll email you a code next — then you can sign
          in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterDetailsForm email={email} />
      </CardContent>
    </Card>
  );
}
