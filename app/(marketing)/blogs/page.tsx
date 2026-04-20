import { getBlogPosts } from "@/app/actions/data";
import { BlogGridCard } from "@/components/marketing/blog-grid-card";
import { Input } from "@/components/ui/input";
import type { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Procurement policy, supplier tips, and regional market news.",
};

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-brand-navy">
                Blogs
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Insights for buyers, suppliers, and partners across the Horn of
                Africa.
              </p>
            </div>
            <form
              className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 lg:w-auto lg:min-w-[320px]"
              action="/blogs"
              method="get"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search articles…"
                className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogGridCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
