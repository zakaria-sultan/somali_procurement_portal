"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { AUTH_MESSAGES } from "@/lib/auth-messages";
import { sendSignupOtpEmail } from "@/lib/email/send-signup-otp";
import {
  createSignupOtpChallenge,
  generateSixDigitCode,
  verifySignupOtpChallenge,
} from "@/lib/otp-code";
import {
  completeAccountSchema,
  registerEmailSchema,
  signupEmailSchema,
  signupOtpSchema,
} from "@/lib/schemas/register";
import { CredentialsSignin } from "next-auth";

import { signIn } from "@/lib/auth";
import prisma from "@/lib/prisma";

const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

function zodIssuesToMessage(issues: { message: string }[]): string {
  return issues.map((i) => i.message).join(" ");
}

export type AuthFormState = {
  ok: boolean;
  message: string;
};

export type VerifyOtpState = {
  message: string;
};

export type RegistrationDetailsState = {
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
    return { ok: false, message: AUTH_MESSAGES.emailPasswordRequired };
  }
  const parsed = signupEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      message: zodIssuesToMessage(parsed.error.issues),
    };
  }

  const emailKey = parsed.data.email.trim().toLowerCase();

  let callbackUrl = String(formData.get("callbackUrl") ?? "/").trim() || "/";
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    callbackUrl = "/";
  }

  let dest: string;
  try {
    const callback = await signIn("credentials", {
      email: emailKey,
      password,
      redirect: false,
      callbackUrl,
    });
    dest = typeof callback === "string" ? callback : "";
  } catch (e) {
    if (e instanceof CredentialsSignin) {
      return { ok: false, message: AUTH_MESSAGES.signInFailed };
    }
    throw e;
  }

  if (
    dest.includes("error=CredentialsSignin") ||
    dest.includes("CredentialsSignin") ||
    dest.includes("error=")
  ) {
    return { ok: false, message: AUTH_MESSAGES.signInFailed };
  }

  let path = callbackUrl;
  if (dest) {
    if (dest.startsWith("/")) {
      path = dest;
    } else {
      try {
        const u = new URL(dest);
        const err = u.searchParams.get("error");
        if (err) {
          return { ok: false, message: AUTH_MESSAGES.signInFailed };
        }
        path = `${u.pathname}${u.search}` || callbackUrl;
      } catch {
        path = callbackUrl;
      }
    }
  }
  redirect(path);
}

/** Step 1: valid Gmail → registration form (no code yet). */
export async function signUpWithEmail(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const emailRaw = String(formData.get("email") ?? "").trim();
  const parsed = registerEmailSchema.safeParse({ email: emailRaw });
  if (!parsed.success) {
    return {
      ok: false,
      message: zodIssuesToMessage(parsed.error.issues),
    };
  }

  const email = parsed.data.email;

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (existing?.passwordHash) {
    return { ok: false, message: AUTH_MESSAGES.accountExists };
  }

  if (existing && !existing.passwordHash) {
    return {
      ok: false,
      message:
        "This email is already registered with Google. Please use “Continue with Google” on the sign-in page instead of creating a password here.",
    };
  }

  redirect(`/auth/register?email=${encodeURIComponent(email)}`);
}

/** Step 2: save profile + hash password, send OTP → verify email page. */
export async function submitRegistrationDetails(
  _prev: RegistrationDetailsState,
  formData: FormData
): Promise<RegistrationDetailsState> {
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
      message: zodIssuesToMessage(parsed.error.issues),
    };
  }

  const email = parsed.data.email.trim().toLowerCase();

  const emailStep = registerEmailSchema.safeParse({ email });
  if (!emailStep.success) {
    return {
      ok: false,
      message: zodIssuesToMessage(emailStep.error.issues),
    };
  }

  if (emailStep.data.email !== email) {
    return {
      ok: false,
      message:
        "Use the same Gmail address you entered on the first step, or go back and start again.",
    };
  }

  const exists = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (exists) {
    return {
      ok: false,
      message: AUTH_MESSAGES.accountExists,
    };
  }

  let passwordHash: string;
  try {
    passwordHash = await bcrypt.hash(parsed.data.password, 12);
  } catch {
    return {
      ok: false,
      message: AUTH_MESSAGES.profileSaveFailed,
    };
  }

  const expiresAt = new Date(Date.now() + DRAFT_TTL_MS);

  try {
    await prisma.registrationDraft.upsert({
      where: { email },
      create: {
        email,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        residence: parsed.data.residence,
        gender: parsed.data.gender,
        passwordHash,
        expiresAt,
      },
      update: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        residence: parsed.data.residence,
        gender: parsed.data.gender,
        passwordHash,
        expiresAt,
      },
    });
  } catch {
    return {
      ok: false,
      message: AUTH_MESSAGES.profileSaveFailed,
    };
  }

  const code = generateSixDigitCode();
  await createSignupOtpChallenge(email, code);
  const sent = await sendSignupOtpEmail(email, code);

  if (sent.mode === "not_configured") {
    await prisma.registrationDraft.deleteMany({ where: { email } });
    return { ok: false, message: AUTH_MESSAGES.emailNotConfigured };
  }

  redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`);
}

/** Step 3: correct code → create user → sign-in page. */
export async function verifySignupOtp(
  _prev: VerifyOtpState,
  formData: FormData
): Promise<VerifyOtpState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim();

  const emailParsed = registerEmailSchema.safeParse({ email });
  if (!emailParsed.success) {
    return { message: zodIssuesToMessage(emailParsed.error.issues) };
  }

  const codeParsed = signupOtpSchema.safeParse({ code });
  if (!codeParsed.success) {
    return { message: zodIssuesToMessage(codeParsed.error.issues) };
  }

  const result = await verifySignupOtpChallenge(
    emailParsed.data.email,
    codeParsed.data.code
  );

  if (result === "locked") {
    return { message: AUTH_MESSAGES.otpLocked };
  }
  if (result === "expired") {
    return {
      message:
        "That code has expired. Go back to registration and submit your details again so we can send a new code.",
    };
  }
  if (result !== "ok") {
    return { message: AUTH_MESSAGES.otpInvalid };
  }

  const draft = await prisma.registrationDraft.findUnique({
    where: { email: emailParsed.data.email },
  });

  if (!draft || draft.expiresAt.getTime() < Date.now()) {
    await prisma.registrationDraft.deleteMany({
      where: { email: emailParsed.data.email },
    });
    return {
      message:
        "Your registration session expired. Please start again from the sign-up page.",
    };
  }

  try {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: draft.email,
          name: draft.fullName,
          emailVerified: new Date(),
          passwordHash: draft.passwordHash,
          phone: draft.phone,
          residence: draft.residence,
          gender: draft.gender,
          role: "USER",
        },
      }),
      prisma.registrationDraft.delete({ where: { email: draft.email } }),
    ]);
  } catch {
    return {
      message: AUTH_MESSAGES.profileSaveFailed,
    };
  }

  redirect("/auth/signin?registered=1");
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
      message: AUTH_MESSAGES.resetInvalidEmail,
    };
  }
  return {
    ok: true,
    message: AUTH_MESSAGES.resetGeneric,
  };
}
