import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SITE_CONTACT, whatsappUrl } from "@/lib/contact-constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Somali Procurement Portal team.",
};

const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Mogadishu%2C+Somalia&output=embed&hl=en&z=13";

const MAP_OPEN_HREF =
  "https://www.google.com/maps/search/?api=1&query=Mogadishu%2C+Somalia";

export default function ContactPage() {
  const prefilledWhatsApp = whatsappUrl(
    "Hello Somali Procurement Portal — I would like to get in touch regarding partnerships or listings."
  );

  return (
    <div className="bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-brand-navy dark:text-white">
            Contact us
          </h1>
          <p className="mt-2 text-sm text-brand-navy/85 dark:text-slate-400">
            Partnerships, media, and vendor onboarding — we respond within two
            business days.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <Card className="border-0 bg-white shadow-md ring-1 ring-slate-200/80 dark:bg-card dark:ring-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-brand-navy dark:text-white">
                Send a message
              </CardTitle>
              <CardDescription>
                Name, email, and message are required. You can also reach us on
                WhatsApp (opens in a new tab).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-0 bg-white shadow-md ring-1 ring-slate-200/80 dark:bg-card dark:ring-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-brand-navy dark:text-white">
                  Offices
                </CardTitle>
                <CardDescription>
                  Mogadishu and Hargeisa liaison desks — full suite numbers
                  coming soon.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/15 text-brand-cyan">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <div className="space-y-2 text-brand-navy/90 dark:text-slate-300">
                    <p className="font-medium text-brand-navy dark:text-white">
                      Mogadishu
                    </p>
                    <p>{SITE_CONTACT.addressMogadishu}</p>
                    <p className="font-medium text-brand-navy dark:text-white">
                      Hargeisa
                    </p>
                    <p>{SITE_CONTACT.addressHargeisa}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/15 text-brand-cyan">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${SITE_CONTACT.email}`}
                      className="font-medium text-brand-cyan hover:underline"
                    >
                      {SITE_CONTACT.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/15 text-brand-cyan">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${SITE_CONTACT.phoneTel}`}
                      className="font-medium text-foreground hover:text-brand-cyan"
                    >
                      {SITE_CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>
                <a
                  href={prefilledWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline"
                >
                  Message us on WhatsApp
                  <ExternalLink className="size-3.5 opacity-80" aria-hidden />
                </a>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-white p-0 shadow-md ring-1 ring-slate-200/80 dark:bg-card dark:ring-white/10">
              <div className="border-b border-slate-100 px-5 py-3 dark:border-white/10">
                <p className="text-sm font-medium text-brand-navy dark:text-white">
                  Map — Mogadishu office area
                </p>
                <a
                  href={MAP_OPEN_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-cyan hover:underline"
                >
                  Open in Google Maps
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </div>
              <iframe
                title="Mogadishu office location"
                src={MAP_EMBED_SRC}
                className="aspect-[4/3] w-full border-0 bg-slate-200 dark:bg-slate-800"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
