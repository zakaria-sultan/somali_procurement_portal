"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertSuperAdmin } from "@/app/actions/admin-guard";
import { ADMIN_EMAIL } from "@/lib/auth-constants";
import prisma from "@/lib/prisma";

const setRoleSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(["ADMIN", "USER"]),
});

export type SetUserRoleState = { error?: string; ok?: boolean } | null;

export async function setUserRoleAction(
  _prev: SetUserRoleState,
  formData: FormData
): Promise<SetUserRoleState> {
  await assertSuperAdmin();

  const parsed = setRoleSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and role." };
  }

  const { email, role } = parsed.data;
  if (email === ADMIN_EMAIL.toLowerCase() && role === "USER") {
    return { error: "The primary super-admin account cannot be demoted." };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (!user) {
    return {
      error:
        "No account with that email. The user must sign in at least once before you can change their role.",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function listUsersForSuperAdmin() {
  await assertSuperAdmin();
  return prisma.user.findMany({
    where: { email: { not: null } },
    orderBy: { email: "asc" },
    select: { id: true, email: true, name: true, role: true },
  });
}
