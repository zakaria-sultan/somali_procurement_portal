"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpWithEmail, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initial: AuthFormState = { ok: false, message: "" };

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpWithEmail, initial);

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-full border-foreground/20"
        disabled
        title="Google sign-up coming soon"
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
        <p className="text-xs leading-relaxed text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="text-primary">Terms of use</span> and{" "}
          <span className="text-primary">Privacy policy</span>.
        </p>
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
          {pending ? "Please wait…" : "Continue"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
