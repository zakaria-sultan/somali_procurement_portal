import Link from "next/link";

import { deleteTender } from "@/app/actions/admin-mutations";
import { AdminListFlash } from "@/components/admin/admin-list-flash";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { tenderCategoryBadgeClassName } from "@/lib/tender-category-badge";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{
    deleted?: string;
    deleteError?: string;
  }>;
};

export default async function AdminTendersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const deleted = sp.deleted === "1";
  const deleteError =
    sp.deleteError === "invalid" || sp.deleteError === "notfound"
      ? sp.deleteError
      : null;

  const rows = await prisma.tender.findMany({
    orderBy: { postedDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminListFlash deleted={deleted} deleteError={deleteError} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Tenders</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, or remove procurement notices.
          </p>
        </div>
        <Link
          href="/admin/tenders/new"
          className={cn(buttonVariants(), "inline-flex rounded-xl")}
        >
          New tender
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium">{t.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      tenderCategoryBadgeClassName(t.category)
                    )}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.postedDate.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/tenders/${t.id}/edit`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "inline-flex rounded-lg"
                      )}
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteForm
                      action={deleteTender}
                      id={t.id}
                      itemLabel={t.title}
                      resourceLabel="tender"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No tenders yet. Run{" "}
            <code className="rounded bg-muted px-1">npx prisma db seed</code> or
            create one.
          </p>
        ) : null}
      </div>
    </div>
  );
}
