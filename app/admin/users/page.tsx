import { assertSuperAdmin } from "@/app/actions/admin-guard";
import { listUsersForSuperAdmin } from "@/app/actions/admin-users";
import { AdminUserRoleForm } from "@/components/admin/admin-user-role-form";
import { ADMIN_EMAIL } from "@/lib/auth-constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminUsersPage() {
  await assertSuperAdmin();
  const users = await listUsersForSuperAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Admin users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Promote or demote accounts that have already signed in. Only the
          primary super-admin can access this page.
        </p>
      </div>

      <Card className="overflow-hidden border-brand-cyan/20 shadow-sm">
        <CardHeader className="border-b border-border/80 bg-gradient-to-r from-brand-navy/5 to-brand-cyan/10 dark:from-brand-navy/20 dark:to-brand-cyan/5">
          <CardTitle className="text-base">Change role by email</CardTitle>
          <CardDescription>
            Use the exact email the person uses to sign in (Google or
            credentials).
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
            Super-admin:{" "}
            <span className="font-medium text-foreground">{ADMIN_EMAIL}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {users.map((u) => {
                  const superUser =
                    u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
                  return (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {u.email ?? "—"}
                        {superUser ? (
                          <span className="ml-2 rounded-md bg-brand-cyan/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-brand-cyan">
                            primary
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {u.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            u.role === "ADMIN"
                              ? "rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200"
                              : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {u.role}
                        </span>
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
