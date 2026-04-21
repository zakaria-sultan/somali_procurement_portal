type AdminListFlashProps = {
  deleted?: boolean;
  deleteError?: "invalid" | "notfound" | null;
};

export function AdminListFlash({ deleted, deleteError }: AdminListFlashProps) {
  if (deleted) {
    return (
      <div
        className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100"
        role="status"
      >
        Item deleted successfully.
      </div>
    );
  }
  if (deleteError === "invalid") {
    return (
      <div
        className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        role="alert"
      >
        Invalid delete request. Nothing was removed.
      </div>
    );
  }
  if (deleteError === "notfound") {
    return (
      <div
        className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
        role="alert"
      >
        That item was not found. It may have already been deleted.
      </div>
    );
  }
  return null;
}
