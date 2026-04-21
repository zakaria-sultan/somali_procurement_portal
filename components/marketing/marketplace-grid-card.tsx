import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { MarketplaceItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MarketplaceGridCard({
  item,
  className,
}: {
  item: MarketplaceItem;
  className?: string;
}) {
  const href = `/marketplace/${item.id}`;
  const imageSrc = item.imageUrl?.trim() ?? "";

  return (
    <Card className={cn("overflow-hidden p-0 pb-4 ring-0", className)}>
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-muted to-muted/40">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="px-4 pt-3">
        <p className="text-xs text-muted-foreground">
          {item.category}
          <span className="text-foreground/40"> · </span>
          <span className="font-medium text-foreground">{item.price}</span>
        </p>
        <Link
          href={href}
          className="mt-1 line-clamp-2 font-heading text-sm font-semibold text-foreground hover:text-brand-cyan"
        >
          {item.title}
        </Link>
      </div>
    </Card>
  );
}
