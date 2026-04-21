"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertSuperAdmin } from "@/app/actions/admin-guard";
import prisma from "@/lib/prisma";

const setRoleSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]),
});

const idSchema = z.string().cuid();

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

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (!user) {
    return {
      error:
        "No account with that email. The user must sign in at least once before you can change their role.",
    };
  }

  if (user.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const superCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (superCount <= 1) {
      return {
        error:
          "Cannot remove the last super admin. Promote another account to Super admin first, then demote this one.",
      };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true };
}

export async function listUsersForSuperAdmin() {
  await assertSuperAdmin();
  return prisma.user.findMany({
    where: { email: { not: null } },
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      lastLoginAt: true,
    },
  });
}

export type UserMutationState = { error?: string; ok?: boolean } | null;

export async function deleteUserAction(
  _prev: UserMutationState,
  formData: FormData
): Promise<UserMutationState> {
  const session = await assertSuperAdmin();
  const idParsed = idSchema.safeParse(String(formData.get("userId") ?? ""));
  if (!idParsed.success) {
    return { error: "Invalid user." };
  }
  const userId = idParsed.data;

  if (userId === session.user.id) {
    return { error: "You cannot delete your own account." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });
  if (!target) return { error: "User not found." };

  if (target.role === "SUPER_ADMIN") {
    const superCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (superCount <= 1) {
      return { error: "Cannot delete the last super admin." };
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true };
}
