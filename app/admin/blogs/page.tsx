import Link from "next/link";

import { deleteBlogPost } from "@/app/actions/admin-deletes";
import { AdminListFlash } from "@/components/admin/admin-list-flash";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{
    deleted?: string;
    deleteError?: string;
  }>;
};

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const deleted = sp.deleted === "1";
  const deleteError =
    sp.deleteError === "invalid" || sp.deleteError === "notfound"
      ? sp.deleteError
      : null;

  const rows = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminListFlash deleted={deleted} deleteError={deleteError} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Blogs</h1>
          <p className="text-sm text-muted-foreground">
            Articles with optional cover image (Blob).
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className={cn(buttonVariants(), "inline-flex rounded-xl")}
        >
          New article
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.category}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blogs/${b.id}/edit`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "inline-flex rounded-lg"
                      )}
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteForm
                      action={deleteBlogPost}
                      id={b.id}
                      itemLabel={b.title}
                      resourceLabel="article"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No articles yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
