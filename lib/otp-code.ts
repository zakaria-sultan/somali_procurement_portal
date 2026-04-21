import { createHash, randomInt } from "node:crypto";

import prisma from "@/lib/prisma";

const PEPPER = () =>
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-pepper";

export function generateSixDigitCode(): string {
  return String(randomInt(100_000, 1_000_000));
}

export function hashSignupOtp(email: string, code: string): string {
  const normalized = email.trim().toLowerCase();
  return createHash("sha256")
    .update(`${PEPPER()}:${normalized}:${code}`)
    .digest("hex");
}

const MAX_ATTEMPTS = 8;
const OTP_TTL_MS = 15 * 60 * 1000;

export async function createSignupOtpChallenge(email: string, code: string) {
  const normalized = email.trim().toLowerCase();
  const codeHash = hashSignupOtp(normalized, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.signupOtp.deleteMany({ where: { email: normalized } });
  await prisma.signupOtp.create({
    data: { email: normalized, codeHash, expiresAt },
  });
}

export async function verifySignupOtpChallenge(
  email: string,
  code: string
): Promise<"ok" | "invalid" | "locked" | "expired"> {
  const normalized = email.trim().toLowerCase();
  const row = await prisma.signupOtp.findFirst({
    where: { email: normalized },
    orderBy: { createdAt: "desc" },
  });

  if (!row) return "invalid";
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.signupOtp.delete({ where: { id: row.id } });
    return "expired";
  }
  if (row.attempts >= MAX_ATTEMPTS) return "locked";

  const expectedHash = hashSignupOtp(normalized, code.trim());
  if (expectedHash !== row.codeHash) {
    await prisma.signupOtp.update({
      where: { id: row.id },
      data: { attempts: { increment: 1 } },
    });
    return "invalid";
  }

  await prisma.signupOtp.deleteMany({ where: { email: normalized } });
  return "ok";
}
