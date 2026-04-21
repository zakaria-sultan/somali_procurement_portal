"use client";

import { useActionState } from "react";

import { setUserRoleAction } from "@/app/actions/admin-users";
import type { SetUserRoleState } from "@/app/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
);

export function AdminUserRoleForm() {
  const [state, formAction, pending] = useActionState<
    SetUserRoleState,
    FormData
  >(setUserRoleAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <div
          className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}
      {state?.ok ? (
        <div
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100"
          role="status"
        >
          Role updated. The user may need to refresh or see changes on their next
          request.
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="promote-email">Email</Label>
          <Input
            id="promote-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="colleague@organization.org"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promote-role">Role</Label>
          <select
            id="promote-role"
            name="role"
            defaultValue="ADMIN"
            className={selectClass}
          >
            <option value="USER">User (member)</option>
            <option value="ADMIN">Admin (content)</option>
            <option value="SUPER_ADMIN">Super admin (content + users)</option>
          </select>
        </div>
      </div>
      <Button type="submit" disabled={pending} className="rounded-xl">
        {pending ? "Saving…" : "Update role"}
      </Button>
    </form>
  );
}
