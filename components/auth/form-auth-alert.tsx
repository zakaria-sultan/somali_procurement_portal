"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type FormAuthAlertProps = {
  variant: "success" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormAuthAlert({
  variant,
  title,
  children,
  className,
}: FormAuthAlertProps) {
  const isOk = variant === "success";
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
        isOk
          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-950 dark:text-emerald-50"
          : "border-destructive/35 bg-destructive/10 text-destructive",
        className
      )}
    >
      {isOk ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden />
      ) : (
        <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
      )}
      <div className="min-w-0 space-y-1">
        {title ? (
          <p className="font-semibold">{title}</p>
        ) : isOk ? (
          <p className="font-semibold">You&apos;re all set</p>
        ) : (
          <p className="font-semibold">Something wasn&apos;t quite right</p>
        )}
        <div className="text-[0.9375rem] opacity-95">{children}</div>
      </div>
    </div>
  );
}
