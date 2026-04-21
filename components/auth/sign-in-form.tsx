"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useActionState } from "react";

import { signInWithEmail, type AuthFormState } from "@/app/actions/auth";
import { FormAuthAlert } from "@/components/auth/form-auth-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initial: AuthFormState = { ok: false, message: "" };

export function SignInForm({
  justRegistered = false,
  callbackUrl = "/",
}: {
  justRegistered?: boolean;
  callbackUrl?: string;
}) {
  const [state, formAction, pending] = useActionState(signInWithEmail, initial);
  const safeCallback =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  return (
    <div className="space-y-6">
      {justRegistered ? (
        <FormAuthAlert variant="success" title="Welcome aboard">
          Your email is verified and your account is ready. Sign in with your
          Gmail address and password to open the site, or use Google if you
          linked that way.
        </FormAuthAlert>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-full border-foreground/20"
        onClick={() => {
          void signIn("google", { callbackUrl: safeCallback });
        }}
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
        <input type="hidden" name="callbackUrl" value={safeCallback} />
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
          />
        </div>
        <div className="text-left text-sm">
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {state.message ? (
          state.ok ? (
            <FormAuthAlert variant="success">{state.message}</FormAuthAlert>
          ) : (
            <FormAuthAlert variant="error">{state.message}</FormAuthAlert>
          )
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
