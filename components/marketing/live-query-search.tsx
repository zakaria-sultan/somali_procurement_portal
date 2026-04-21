"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

type Props = {
  /** e.g. `/blogs` or `/marketplace` */
  pathname: string;
  paramName?: string;
  placeholder: string;
  /** Server-rendered initial value from URL */
  defaultValue: string;
  className?: string;
  inputClassName?: string;
  debounceMs?: number;
};

export function LiveQuerySearch({
  pathname,
  paramName = "q",
  placeholder,
  defaultValue,
  className,
  inputClassName,
  debounceMs = 350,
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <label className={className}>
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <Input
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            const t = v.trim();
            router.replace(t ? `${pathname}?${paramName}=${encodeURIComponent(t)}` : pathname, {
              scroll: false,
            });
          }, debounceMs);
        }}
        placeholder={placeholder}
        className={inputClassName}
        aria-label={placeholder}
      />
    </label>
  );
}
