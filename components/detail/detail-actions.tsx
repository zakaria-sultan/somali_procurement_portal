"use client";

import { Copy, Printer, Share2 } from "lucide-react";
import { useCallback } from "react";

import { IconFacebook, IconLinkedin } from "@/components/layout/social-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function DetailActions({
  path,
  title,
  className,
}: {
  path: string;
  title: string;
  className?: string;
}) {
  const fullUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${path}`;
  }, [path]);

  const copy = useCallback(async () => {
    const url = fullUrl();
    if (!url) return;
    await navigator.clipboard.writeText(url);
  }, [fullUrl]);

  const shareNative = useCallback(async () => {
    const url = fullUrl();
    if (!url || !navigator.share) return;
    try {
      await navigator.share({ title, url });
    } catch {
      /* user cancelled */
    }
  }, [fullUrl, title]);

  const open = useCallback(
    (href: string) => {
      window.open(href, "_blank", "noopener,noreferrer");
    },
    []
  );

  return (
    <div className={cn("flex flex-wrap gap-2 print:hidden", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
          )}
        >
          <Share2 className="size-4" />
          Share
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-48">
          <DropdownMenuItem onClick={() => void shareNative()}>
            Share via device…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void copy()}>
            <Copy className="size-4" />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl())}`
              )
            }
          >
            Post to X
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl())}`
              )
            }
          >
            <IconLinkedin className="size-4" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl())}`
              )
            }
          >
            <IconFacebook className="size-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              open(
                `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl()}`)}`
              )
            }
          >
            WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        onClick={() => window.print()}
      >
        <Printer className="size-4" />
        Print
      </Button>
    </div>
  );
}
