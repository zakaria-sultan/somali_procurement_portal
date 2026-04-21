"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { deleteUserAction } from "@/app/actions/admin-users";
import { Button } from "@/components/ui/button";

export function AdminUserRowActions({
  userId,
  isSelf,
}: {
  userId: string;
  isSelf: boolean;
}) {
  const [state, action, pending] = useActionState(deleteUserAction, null);
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    if (!state?.ok) return;
    void update();
    router.refresh();
  }, [state?.ok, update, router]);

  if (isSelf) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <form action={action} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="userId" value={userId} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        className="rounded-lg text-xs"
        disabled={pending}
        onClick={(e) => {
          if (
            !confirm(
              "Permanently delete this user? They will lose access immediately."
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        {pending ? "…" : "Delete"}
      </Button>
      {state?.error ? (
        <span className="max-w-[12rem] text-right text-[0.65rem] text-destructive">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
