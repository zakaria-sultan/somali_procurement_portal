"use client";

import Image from "next/image";
import { useActionState } from "react";

import {
  createMarketplaceListing,
  updateMarketplaceListing,
  type AdminActionState,
} from "@/app/actions/admin-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MarketplaceDetail } from "@/lib/types";

const initial: AdminActionState = { ok: true, message: "" };

const HIGHLIGHT_SLOTS = 6;

export function NewMarketplaceForm() {
  const [state, action] = useActionState(createMarketplaceListing, initial);
  return <MarketplaceFields action={action} state={state} />;
}

export function EditMarketplaceForm({ item }: { item: MarketplaceDetail }) {
  const [state, action] = useActionState(updateMarketplaceListing, initial);
  return <MarketplaceFields action={action} state={state} item={item} />;
}

function MarketplaceFields({
  action,
  state,
  item,
}: {
  action: (payload: FormData) => void;
  state: AdminActionState;
  item?: MarketplaceDetail;
}) {
  const c = item?.contact ?? {
    email: "info@somaliprocurementportal.com",
    phoneDisplay: "+252 63 000 0000",
    phoneTel: "+252630000000",
    whatsappDigits: "252630000000",
  };
  const highlights = item?.highlights ?? [];

  return (
    <form action={action} className="space-y-5">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      {item ? (
        <input type="hidden" name="imageUrl" value={item.imageUrl} />
      ) : null}
      {state.message && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={item?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" required defaultValue={item?.price} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            required
            defaultValue={item?.category}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="seller">Seller</Label>
          <Input
            id="seller"
            name="seller"
            required
            defaultValue={item?.seller}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            className="min-h-[120px]"
            defaultValue={item?.description}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Image file (Vercel Blob)</Label>
          {item?.imageUrl?.trim() ? (
            <div className="relative mb-2 max-h-56 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-muted">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={item.imageUrl.trim()}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width:896px) 100vw, 512px"
                />
              </div>
              <p className="border-t border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                Current listing image — choose a new file below to replace it.
              </p>
            </div>
          ) : null}
          <Input id="image" name="image" type="file" accept="image/*" />
          <p className="text-xs text-muted-foreground">
            {item
              ? "Leave empty to keep the current image."
              : "Upload a file or add a direct URL below."}
          </p>
        </div>
        {!item ? (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="imageUrl">Image URL (optional if file uploaded)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://"
            />
          </div>
        ) : null}

        <div className="space-y-3 sm:col-span-2">
          <Label className="text-base">Highlights</Label>
          <p className="text-xs text-muted-foreground">
            Short bullet points (optional). Empty rows are ignored.
          </p>
          <div className="space-y-2">
            {Array.from({ length: HIGHLIGHT_SLOTS }, (_, i) => (
              <Input
                key={i}
                name="highlight"
                placeholder={`Highlight ${i + 1}`}
                defaultValue={highlights[i] ?? ""}
                maxLength={500}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:col-span-2 rounded-xl border border-border bg-muted/20 p-4">
          <Label className="text-base">Contact</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                defaultValue={c.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhoneDisplay">Phone (display)</Label>
              <Input
                id="contactPhoneDisplay"
                name="contactPhoneDisplay"
                required
                placeholder="+252 63 000 0000"
                defaultValue={c.phoneDisplay}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhoneTel">Phone (tel link)</Label>
              <Input
                id="contactPhoneTel"
                name="contactPhoneTel"
                required
                placeholder="+252630000000"
                defaultValue={c.phoneTel}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contactWhatsappDigits">WhatsApp (digits only)</Label>
              <Input
                id="contactWhatsappDigits"
                name="contactWhatsappDigits"
                required
                placeholder="252630000000"
                inputMode="numeric"
                defaultValue={c.whatsappDigits}
              />
              <p className="text-xs text-muted-foreground">
                No + or spaces — used in{" "}
                <code className="rounded bg-muted px-1">wa.me</code> links.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button type="submit" className="rounded-xl">
        {item ? "Save listing" : "Create listing"}
      </Button>
    </form>
  );
}
