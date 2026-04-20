import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

function Mark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      width={160}
      height={160}
      className={cn("h-10 w-auto shrink-0 object-contain", className)}
      priority
    />
  );
}

export function Logo({
  className,
  withText = true,
  variant = "default",
}: {
  className?: string;
  withText?: boolean;
  variant?: "default" | "onDark";
}) {
  const textClass =
    variant === "onDark"
      ? "text-white"
      : "text-brand-navy dark:text-white";

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-x-4 outline-none", className)}
    >
      <Mark />
      {withText ? (
        <span
          className={cn(
            "text-sm font-semibold leading-tight tracking-tight sm:text-base",
            textClass
          )}
        >
          Somali Procurement Portal
        </span>
      ) : null}
    </Link>
  );
}

export function LogoStacked({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex flex-col items-center gap-3 outline-none", className)}
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={192}
        height={192}
        className="size-12 object-contain"
      />
      <span className="text-center text-base font-semibold tracking-tight text-brand-navy dark:text-white">
        Somali Procurement Portal
      </span>
    </Link>
  );
}
