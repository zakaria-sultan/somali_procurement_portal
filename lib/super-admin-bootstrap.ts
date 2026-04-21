import { ADMIN_EMAIL } from "@/lib/auth-constants";
import prisma from "@/lib/prisma";

/**
 * If no `SUPER_ADMIN` exists, promote the legacy bootstrap email once.
 * Keeps production usable after migrate until someone is assigned SUPER_ADMIN.
 */
export async function ensureSuperAdminBootstrapped(): Promise<void> {
  const count = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
  if (count > 0) return;

  const candidate = await prisma.user.findFirst({
    where: { email: { equals: ADMIN_EMAIL, mode: "insensitive" } },
    select: { id: true },
  });
  if (!candidate) return;

  await prisma.user.update({
    where: { id: candidate.id },
    data: { role: "SUPER_ADMIN" },
  });
}
