import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogDetail, getRelatedBlogs } from "@/app/actions/data";
import { DetailActions } from "@/components/detail/detail-actions";
import { RelatedSection } from "@/components/detail/related-section";
import { BlogGridCard } from "@/components/marketing/blog-grid-card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogDetail(id);
  if (!post) return { title: "Article" };
  return {
    title: post.title.slice(0, 72),
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogDetail(id);
  if (!post) notFound();

  const related = await getRelatedBlogs(post.id, post.category, 3);
  const path = `/blogs/${post.id}`;

  return (
    <div className="bg-background print:bg-white">
      <article className="mx-auto max-w-3xl px-4 py-8 print:text-black sm:px-6 lg:px-8">
        <div className="mb-6 print:hidden">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            ← Back to blogs
          </Link>
        </div>

        <header className="space-y-4 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span aria-hidden>|</span>
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-brand-navy dark:text-foreground"
          >
            {post.category}
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          <DetailActions path={path} title={post.title} />
        </header>

        <div className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {post.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <RelatedSection title="Related articles">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {related.map((b) => (
            <BlogGridCard key={b.id} post={b} />
          ))}
        </div>
      </RelatedSection>
    </div>
  );
}
