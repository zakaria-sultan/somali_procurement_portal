"use server";

import { redirect } from "next/navigation";

import {
  completeAccountSchema,
  signupEmailSchema,
} from "@/lib/schemas/register";

export type AuthFormState = {
  ok: boolean;
  message: string;
};

export async function signInWithEmail(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }
  const parsed = signupEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join(" "),
    };
  }
  return {
    ok: true,
    message:
      "NextAuth credentials will be wired in a later step — form validation passed.",
  };
}

export async function signUpWithEmail(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const parsed = signupEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join(" "),
    };
  }
  redirect(
    `/auth/complete-account?email=${encodeURIComponent(parsed.data.email)}`
  );
}

export type CompleteAccountState = {
  ok: boolean;
  message: string;
};

export async function completeAccount(
  _prev: CompleteAccountState,
  formData: FormData
): Promise<CompleteAccountState> {
  const cc = String(formData.get("countryCode") ?? "252").replace(/\D/g, "");
  const local = String(formData.get("phoneLocal") ?? "").replace(/\D/g, "");
  const phone = local ? `+${cc}${local}` : "";

  const raw = {
    email: String(formData.get("email") ?? "").trim(),
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone,
    residence: String(formData.get("residence") ?? "").trim(),
    gender: String(formData.get("gender") ?? "") as "male" | "female" | "",
    password: String(formData.get("password") ?? ""),
  };

  const parsed = completeAccountSchema.safeParse({
    email: raw.email,
    fullName: raw.fullName,
    phone: raw.phone,
    residence: raw.residence,
    gender: raw.gender || undefined,
    password: raw.password,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join(" "),
    };
  }

  // Stub: persist with Prisma + hash password in a later step
  return {
    ok: true,
    message:
      "Profile saved (demo). You can now sign in once NextAuth is connected.",
  };
}

export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const parsed = signupEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join(" ") || "Enter your email.",
    };
  }
  return {
    ok: true,
    message:
      "If an account exists for that email, reset instructions will be sent (stub).",
  };
}
