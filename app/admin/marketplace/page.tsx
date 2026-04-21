import Link from "next/link";

import { deleteMarketplaceListing } from "@/app/actions/admin-deletes";
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

export default async function AdminMarketplacePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const deleted = sp.deleted === "1";
  const deleteError =
    sp.deleteError === "invalid" || sp.deleteError === "notfound"
      ? sp.deleteError
      : null;

  const rows = await prisma.marketplaceListing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminListFlash deleted={deleted} deleteError={deleteError} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Listings with image upload to Vercel Blob.
          </p>
        </div>
        <Link
          href="/admin/marketplace/new"
          className={cn(buttonVariants(), "inline-flex rounded-xl")}
        >
          New listing
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.price}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/marketplace/${m.id}/edit`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "inline-flex rounded-lg"
                      )}
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteForm
                      action={deleteMarketplaceListing}
                      id={m.id}
                      itemLabel={m.title}
                      resourceLabel="listing"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No listings yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
