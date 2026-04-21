"use client";

import Link from "next/link";
import { useActionState } from "react";

import { verifySignupOtp, type VerifyOtpState } from "@/app/actions/auth";
import { FormAuthAlert } from "@/components/auth/form-auth-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: VerifyOtpState = { message: "" };

export function VerifyEmailForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(verifySignupOtp, initial);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="email" value={email} />
      <div className="space-y-2">
        <Label htmlFor="code">Verification code</Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="\d{6}"
          required
          placeholder="000000"
          className="font-mono text-lg tracking-[0.35em]"
          aria-describedby="code-hint"
        />
        <p id="code-hint" className="text-xs text-muted-foreground">
          Enter the 6-digit code from the message we sent to{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>
      {state.message ? (
        <FormAuthAlert variant="error">{state.message}</FormAuthAlert>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full uppercase tracking-wide"
      >
        {pending ? "Checking…" : "Verify and continue"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Wrong address?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Start over
        </Link>
      </p>
    </form>
  );
}
