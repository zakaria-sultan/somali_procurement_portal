"use client";

import { Button } from "@/components/ui/button";

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => void;
  id: string;
  /** Shown in the confirmation dialog (e.g. listing title). */
  itemLabel: string;
  /** Resource name for the default message, e.g. "listing", "article", "tender". */
  resourceLabel: string;
};

export function ConfirmDeleteForm({
  action,
  id,
  itemLabel,
  resourceLabel,
}: ConfirmDeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const name = itemLabel.trim() || `this ${resourceLabel}`;
        const ok = window.confirm(
          `Delete “${name}”? This cannot be undone.`
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" className="rounded-lg">
        Delete
      </Button>
    </form>
  );
}
