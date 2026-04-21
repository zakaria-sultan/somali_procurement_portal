import { assertSuperAdmin } from "@/app/actions/admin-guard";
import { listUsersForSuperAdmin } from "@/app/actions/admin-users";
import { AdminUserRoleForm } from "@/components/admin/admin-user-role-form";
import { AdminUserRowActions } from "@/components/admin/admin-user-row-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatLastLogin(at: Date | null): string {
  if (!at) return "—";
  return at.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function roleBadgeClass(role: string): string {
  if (role === "SUPER_ADMIN") {
    return "rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-800 dark:text-violet-200";
  }
  if (role === "ADMIN") {
    return "rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200";
  }
  return "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground";
}

export default async function AdminUsersPage() {
  const session = await assertSuperAdmin();
  const users = await listUsersForSuperAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Any account with the <strong>Super admin</strong> role can open this
          page. There is no single “primary” — promote as many super admins as
          you need. Keep at least one super admin so user management stays
          available.
        </p>
      </div>

      <Card className="overflow-hidden border-brand-cyan/20 shadow-sm">
        <CardHeader className="border-b border-border/80 bg-gradient-to-r from-brand-navy/5 to-brand-cyan/10 dark:from-brand-navy/20 dark:to-brand-cyan/5">
          <CardTitle className="text-base">Change role by email</CardTitle>
          <CardDescription>
            Use the exact sign-in email. Roles: <strong>Member</strong> (site
            only), <strong>Admin</strong> (content),{" "}
            <strong>Super admin</strong> (content + this page).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AdminUserRoleForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Accounts</CardTitle>
          <CardDescription>
            {users.filter((u) => u.role === "SUPER_ADMIN").length} super
            admin
            {users.filter((u) => u.role === "SUPER_ADMIN").length === 1
              ? ""
              : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Last sign-in</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {users.map((u) => {
                  const isSelf = u.id === session.user.id;
                  return (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {u.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {u.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(roleBadgeClass(u.role))}>
                          {u.role === "SUPER_ADMIN"
                            ? "Super admin"
                            : u.role === "ADMIN"
                              ? "Admin"
                              : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {formatLastLogin(u.lastLoginAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <AdminUserRowActions
                          userId={u.id}
                          isSelf={isSelf}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
