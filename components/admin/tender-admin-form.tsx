"use client";

import { useActionState } from "react";

import {
  createTender,
  updateTender,
  type AdminActionState,
} from "@/app/actions/admin-mutations";
import { FormAuthAlert } from "@/components/auth/form-auth-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requirementsToPlainText } from "@/lib/schemas/admin";
import type { TenderDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

const initial: AdminActionState = { ok: true, message: "" };

const CATEGORIES = [
  "Tenders",
  "RFQ",
  "Prequalification",
  "Framework",
  "Auction",
] as const;

const DEFAULT_CONTACT = {
  email: "info@somaliprocurementportal.com",
  phoneDisplay: "+252 63 000 0000",
  phoneTel: "+252630000000",
  whatsappDigits: "252630000000",
};

function toDatetimeLocal(d: Date) {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 16);
}

export function NewTenderForm() {
  const [state, action] = useActionState(createTender, initial);
  return <TenderFields action={action} state={state} />;
}

export function EditTenderForm({
  tender,
  postedAt,
  expiresAt,
}: {
  tender: TenderDetail;
  postedAt: Date;
  expiresAt: Date;
}) {
  const [state, action] = useActionState(updateTender, initial);
  return (
    <TenderFields
      action={action}
      state={state}
      tender={tender}
      postedAt={postedAt}
      expiresAt={expiresAt}
    />
  );
}

function TenderFields({
  action,
  state,
  tender,
  postedAt,
  expiresAt,
}: {
  action: (payload: FormData) => void;
  state: AdminActionState;
  tender?: TenderDetail;
  postedAt?: Date;
  expiresAt?: Date;
}) {
  const now = new Date();
  const defaultPosted = postedAt ?? now;
  const defaultExpiry =
    expiresAt ?? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const c = tender?.contact ?? DEFAULT_CONTACT;
  const reqText = tender
    ? requirementsToPlainText(tender.requirements)
    : "";

  return (
    <form action={action} className="space-y-6">
      {tender ? <input type="hidden" name="id" value={tender.id} /> : null}
      {tender?.organizationLogoUrl ? (
        <input
          type="hidden"
          name="organizationLogoUrl"
          value={tender.organizationLogoUrl}
        />
      ) : null}

      {state.message && !state.ok ? (
        <FormAuthAlert variant="error">{state.message}</FormAuthAlert>
      ) : null}

      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 shadow-sm">
        <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tender overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={tender?.title}
              maxLength={500}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              name="organization"
              required
              defaultValue={tender?.organization}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              required
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              defaultValue={tender?.category ?? "Tenders"}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              required
              defaultValue={tender?.location}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postedDate">Posted</Label>
            <Input
              id="postedDate"
              name="postedDate"
              type="datetime-local"
              required
              defaultValue={toDatetimeLocal(defaultPosted)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="datetime-local"
              required
              defaultValue={toDatetimeLocal(defaultExpiry)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              className="min-h-[120px] rounded-xl"
              defaultValue={tender?.description}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="organizationBlurb">Organization blurb</Label>
            <Textarea
              id="organizationBlurb"
              name="organizationBlurb"
              className="min-h-[72px] rounded-xl"
              defaultValue={tender?.organizationBlurb ?? ""}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 shadow-sm">
        <h2 className="mb-1 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Organization logo
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Shown on tender listings and the detail page instead of initials.
        </p>
        <div className="space-y-3">
          <Input
            id="organizationLogo"
            name="organizationLogo"
            type="file"
            accept="image/*"
            className="rounded-xl"
          />
          {tender?.organizationLogoUrl ? (
            <div className="flex flex-wrap items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tender.organizationLogoUrl}
                alt=""
                className="h-14 w-14 rounded-lg border border-border object-contain"
              />
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="clearOrganizationLogo"
                  className="rounded border-input"
                />
                Remove logo
              </label>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 shadow-sm">
        <h2 className="mb-1 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Documents
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          PDF or Word (.doc, .docx). You can select multiple files. At least one
          document is required.
        </p>
        <Input
          id="documents"
          name="documents"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          className="rounded-xl"
          required={!tender || (tender.documents?.length ?? 0) === 0}
        />
        {tender && tender.documents.length > 0 ? (
          <ul className="mt-4 space-y-2 rounded-xl border border-border bg-muted/20 p-3 text-sm">
            {tender.documents.map((d, index) => (
              <li
                key={`${index}-${d.name}-${d.href}`}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="min-w-0 truncate font-medium">{d.name}</span>
                <label className="flex shrink-0 items-center gap-2 text-xs text-destructive">
                  <input
                    type="checkbox"
                    name="removeDocument"
                    value={String(index)}
                    className="rounded border-input"
                  />
                  Remove
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 shadow-sm">
        <h2 className="mb-1 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Requirements
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Write everything in one place — lists, paragraphs, or bullet points.
        </p>
        <Textarea
          id="requirementsText"
          name="requirementsText"
          className="min-h-[160px] rounded-xl"
          placeholder="Describe scope, deliverables, eligibility, deadlines for bidders…"
          defaultValue={reqText}
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 shadow-sm">
        <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Contact (buyer)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              defaultValue={c.email}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhoneDisplay">Phone (display)</Label>
            <Input
              id="contactPhoneDisplay"
              name="contactPhoneDisplay"
              required
              defaultValue={c.phoneDisplay}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhoneTel">Phone (tel link)</Label>
            <Input
              id="contactPhoneTel"
              name="contactPhoneTel"
              required
              defaultValue={c.phoneTel}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contactWhatsappDigits">WhatsApp (digits only)</Label>
            <Input
              id="contactWhatsappDigits"
              name="contactWhatsappDigits"
              required
              defaultValue={c.whatsappDigits}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className={cn("rounded-xl px-8")}>
        {tender ? "Save changes" : "Create tender"}
      </Button>
    </form>
  );
}
