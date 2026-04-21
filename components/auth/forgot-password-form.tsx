"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset, type AuthFormState } from "@/app/actions/auth";
import { FormAuthAlert } from "@/components/auth/form-auth-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthFormState = { ok: false, message: "" };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initial
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>
      {state.message ? (
        state.ok ? (
          <FormAuthAlert variant="success" title="Request received">
            {state.message}
          </FormAuthAlert>
        ) : (
          <FormAuthAlert variant="error">{state.message}</FormAuthAlert>
        )
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full uppercase tracking-wide"
      >
        {pending ? "Please wait…" : "Reset password"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Somali Procurement Portal?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Register now
        </Link>
      </p>
    </form>
  );
}
