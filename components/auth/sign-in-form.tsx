"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInWithEmail, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initial: AuthFormState = { ok: false, message: "" };

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signInWithEmail, initial);

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-full border-foreground/20"
        disabled
        title="Google sign-in coming soon"
      >
        Continue with Google
      </Button>
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          or
        </span>
      </div>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
          />
        </div>
        <div className="text-left text-sm">
          <Link href="/auth/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        {state.message ? (
          <p
            className={
              state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"
            }
            role="status"
          >
            {state.message}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full rounded-full uppercase tracking-wide"
        >
          {pending ? "Please wait…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
