"use client";

import dynamic from "next/dynamic";

import type { TenderDetail } from "@/lib/types";

const formLoading = (
  <div className="flex min-h-[28rem] items-center justify-center rounded-xl border border-dashed border-border bg-muted/25 text-sm text-muted-foreground">
    Loading form…
  </div>
);

const NewTenderForm = dynamic(
  () =>
    import("@/components/admin/tender-admin-form").then((m) => m.NewTenderForm),
  { ssr: false, loading: () => formLoading }
);

const EditTenderForm = dynamic(
  () =>
    import("@/components/admin/tender-admin-form").then((m) => m.EditTenderForm),
  { ssr: false, loading: () => formLoading }
);

export function NewTenderFormLazy() {
  return <NewTenderForm />;
}

export function EditTenderFormLazy({
  tender,
  postedAtIso,
  expiresAtIso,
}: {
  tender: TenderDetail;
  postedAtIso: string;
  expiresAtIso: string;
}) {
  return (
    <EditTenderForm
      tender={tender}
      postedAtIso={postedAtIso}
      expiresAtIso={expiresAtIso}
    />
  );
}
