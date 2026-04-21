/** Mirrors Prisma `Role` — use for session and UI checks. */
export type AppRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export function isContentAdmin(role: string | undefined): role is AppRole {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isUserManager(role: string | undefined): boolean {
  return role === "SUPER_ADMIN";
}

export function roleDisplayLabel(role: string | undefined): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super admin";
    case "ADMIN":
      return "Administrator";
    default:
      return "Member";
  }
}
