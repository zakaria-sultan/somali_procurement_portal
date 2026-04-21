"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { isContentAdmin, isUserManager } from "@/lib/roles";
import { ensureSuperAdminBootstrapped } from "@/lib/super-admin-bootstrap";

export async function assertAdmin() {
  await ensureSuperAdminBootstrapped();
  const session = await auth();
  if (!session?.user || !isContentAdmin(session.user.role)) {
    redirect("/");
  }
  return session;
}

/** User management: requires `SUPER_ADMIN` (multiple accounts may have this role). */
export async function assertSuperAdmin() {
  const session = await assertAdmin();
  if (!isUserManager(session.user.role)) {
    redirect("/admin");
  }
  return session;
}
