"use server";

import { assertAdmin } from "@/app/actions/admin-guard";
import prisma from "@/lib/prisma";

export async function getUserStatsForAdminDashboard() {
  await assertAdmin();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalWithEmail,
    superAdmins,
    admins,
    users,
    signedInLast24h,
    recentLogins,
  ] = await Promise.all([
    prisma.user.count({ where: { email: { not: null } } }),
    prisma.user.count({
      where: { email: { not: null }, role: "SUPER_ADMIN" },
    }),
    prisma.user.count({ where: { email: { not: null }, role: "ADMIN" } }),
    prisma.user.count({ where: { email: { not: null }, role: "USER" } }),
    prisma.user.count({
      where: { lastLoginAt: { gte: dayAgo } },
    }),
    prisma.user.findMany({
      where: { email: { not: null }, lastLoginAt: { not: null } },
      orderBy: { lastLoginAt: "desc" },
      take: 12,
      select: {
        email: true,
        name: true,
        role: true,
        lastLoginAt: true,
      },
    }),
  ]);

  return {
    totalWithEmail,
    superAdmins,
    admins,
    users,
    signedInLast24h,
    recentLogins,
  };
}
