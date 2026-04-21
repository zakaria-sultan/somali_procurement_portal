"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  submitRegistrationDetails,
  type RegistrationDetailsState,
} from "@/app/actions/auth";
import { FormAuthAlert } from "@/components/auth/form-auth-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: RegistrationDetailsState = { ok: false, message: "" };

export function RegisterDetailsForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(
    submitRegistrationDetails,
    initial
  );
  const [showPw, setShowPw] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="email" value={email} />

      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneLocal">Phone</Label>
        <div className="flex gap-2">
          <select
            id="countryCode"
            name="countryCode"
            defaultValue="252"
            className="flex h-8 w-[5.5rem] shrink-0 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Country code"
          >
            <option value="252">🇸🇴 +252</option>
          </select>
          <Input
            id="phoneLocal"
            name="phoneLocal"
            required
            autoComplete="tel-national"
            placeholder="Phone number"
            className="min-w-0 flex-1"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="residence">Residence</Label>
          <Input
            id="residence"
            name="residence"
            required
            autoComplete="address-level2"
            placeholder="Where you live?"
          />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Gender</legend>
          <div className="flex gap-4 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="gender"
                value="male"
                required
                className="size-4 accent-brand-cyan"
              />
              Male
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="gender"
                value="female"
                required
                className="size-4 accent-brand-cyan"
              />
              Female
            </label>
          </div>
        </fieldset>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            required
            autoComplete="new-password"
            placeholder="Password"
            type={showPw ? "text" : "password"}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <span className="text-primary">Terms of use</span> and{" "}
        <span className="text-primary">Privacy policy</span>.
      </p>

      {state.message ? (
        <FormAuthAlert variant="error">{state.message}</FormAuthAlert>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full uppercase tracking-wide"
      >
        {pending ? "Please wait…" : "Continue — send verification code"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Go back
        </Link>
      </p>
    </form>
  );
}
