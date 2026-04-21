"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/auth-constants";

export async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

/** Only the configured super-admin email may manage other admins. */
export async function assertSuperAdmin() {
  const session = await assertAdmin();
  if (session.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    redirect("/admin");
  }
  return session;
}
