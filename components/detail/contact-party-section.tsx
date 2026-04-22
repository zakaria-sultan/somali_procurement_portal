import { Mail, MessageCircle, Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PartyContact } from "@/lib/types";
import { cn } from "@/lib/utils";

type Role = "buyer" | "seller";

export function ContactPartySection({
  role,
  listingTitle,
  organization,
  contact,
}: {
  role: Role;
  listingTitle: string;
  organization: string;
  contact: PartyContact;
}) {
  const label = role === "buyer" ? "Contact buyer" : "Contact seller";
  const waText =
    role === "buyer"
      ? `Hello, I am interested in the Tender: ${listingTitle}`
      : `Hello, I am interested in the listing: ${listingTitle}`;

  const whatsappHref = `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(waText)}`;
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    role === "buyer" ? `Inquiry: ${listingTitle}` : `Marketplace inquiry: ${listingTitle}`
  )}&body=${encodeURIComponent(`${waText}\n\n— Sent via Somali Procurement Portal`)}`;

  const showWa = contact.whatsappDigits.length > 0;
  const showMail = contact.email.length > 0;
  const showTel = contact.phoneTel.length > 0 && contact.phoneDisplay.length > 0;

  return (
    <Card className="gap-0 border-border/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{label}</CardTitle>
        <p className="text-sm text-muted-foreground">{organization}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {showWa ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "default" }),
              "w-full rounded-xl border-transparent bg-[#25D366] text-white hover:bg-[#20BD5A] hover:text-white"
            )}
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        ) : null}
        {showMail ? (
          <a
            href={mailHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-cyan hover:underline"
          >
            <Mail className="size-4 shrink-0 text-brand-cyan" aria-hidden />
            {contact.email}
          </a>
        ) : null}
        {showTel ? (
          <a
            href={`tel:${contact.phoneTel}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand-cyan"
          >
            <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            {contact.phoneDisplay}
          </a>
        ) : null}
        {!showWa && !showMail && !showTel ? (
          <p className="text-sm text-muted-foreground">No contact methods were provided.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
