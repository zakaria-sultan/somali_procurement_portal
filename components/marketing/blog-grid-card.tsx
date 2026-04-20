import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BlogGridCard({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  const href = `/blogs/${post.id}`;

  return (
    <Card className={cn("gap-0 overflow-hidden p-0 ring-0", className)}>
      <Link href={href} className="block">
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-navy/90 via-brand-navy/70 to-brand-cyan/50" />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <span>{post.author}</span>
          <span aria-hidden className="text-border">
            |
          </span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/15 px-2 py-0 text-[0.65rem] font-semibold text-brand-navy dark:text-foreground"
        >
          {post.category}
        </Badge>
        <h2 className="font-heading text-base font-semibold leading-snug text-foreground">
          <Link href={href} className="hover:text-brand-cyan">
            {post.title}
          </Link>
        </h2>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Read more
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
