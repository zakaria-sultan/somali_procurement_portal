import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AdapterUser } from "@auth/core/adapters";
import type { PrismaClient } from "@prisma/client";

import { findUserByEmailForOAuth } from "@/lib/find-user-by-email-oauth";

export function createAuthPrismaAdapter(prisma: PrismaClient) {
  const base = PrismaAdapter(prisma);
  return {
    ...base,
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      if (!email) return null;
      const u = await findUserByEmailForOAuth(prisma, email);
      if (!u?.email) return null;
      return { ...u, email: u.email } as AdapterUser;
    },
  };
}
