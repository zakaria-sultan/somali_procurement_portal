"use client";

import { useActionState } from "react";
import { MessageCircle } from "lucide-react";

import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { whatsappUrl } from "@/lib/contact-constants";

const initial: ContactState = { ok: false, message: "" };

function openWhatsAppFromForm() {
  const name =
    (document.getElementById("name") as HTMLInputElement | null)?.value?.trim() ??
    "";
  const email =
    (document.getElementById("email") as HTMLInputElement | null)?.value?.trim() ??
    "";
  const organization =
    (document.getElementById("organization") as HTMLInputElement | null)?.value
      ?.trim() ?? "";
  const message =
    (document.getElementById("message") as HTMLTextAreaElement | null)?.value
      ?.trim() ?? "";

  const body =
    name && email && message
      ? `Hello Somali Procurement Portal,\n\nName: ${name}\nEmail: ${email}${organization ? `\nOrganization: ${organization}` : ""}\n\n${message}`
      : "Hello, I would like to contact Somali Procurement Portal.";

  window.open(whatsappUrl(body), "_blank", "noopener,noreferrer");
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@organization.org"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="organization">Organization (optional)</Label>
        <Input
          id="organization"
          name="organization"
          placeholder="Company or ministry"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell us how we can help"
          className="min-h-[120px] resize-y"
        />
      </div>
      {state.message ? (
        <p
          className={
            state.ok
              ? "text-sm text-foreground"
              : "text-sm text-destructive"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl sm:w-auto"
        >
          {pending ? "Sending…" : "Send message"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10 sm:w-auto"
          onClick={openWhatsAppFromForm}
        >
          <MessageCircle className="size-4" />
          Send via WhatsApp
        </Button>
      </div>
    </form>
  );
}
