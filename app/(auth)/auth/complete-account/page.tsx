import { redirect } from "next/navigation";

import { registerEmailSchema } from "@/lib/schemas/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete your account",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

/** Legacy URL: registration now lives at /auth/register. */
export default async function CompleteAccountRedirectPage({
  searchParams,
}: Props) {
  const { email: rawEmail } = await searchParams;
  if (!rawEmail) {
    redirect("/auth/signup");
  }
  const decoded = decodeURIComponent(rawEmail);
  const parsed = registerEmailSchema.safeParse({ email: decoded });
  if (!parsed.success) {
    redirect("/auth/signup");
  }
  redirect(
    `/auth/register?email=${encodeURIComponent(parsed.data.email)}`
  );
}
