import Link from "next/link";
import { Send } from "lucide-react";

import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconYoutube,
} from "@/components/layout/social-icons";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const social = [
  { href: "https://facebook.com", label: "Facebook", Icon: IconFacebook },
  { href: "https://instagram.com", label: "Instagram", Icon: IconInstagram },
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: IconLinkedin },
  { href: "https://telegram.org", label: "Telegram", Icon: Send },
  { href: "https://youtube.com", label: "YouTube", Icon: IconYoutube },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-100 print:hidden dark:bg-black dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo variant="onDark" />
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">
              Visit us: Mogadishu & Hargeisa liaison offices (addresses coming
              soon).
            </p>
            <p className="text-sm text-slate-300">
              Email:{" "}
              <a
                href="mailto:info@somaliprocurementportal.com"
                className="text-brand-cyan hover:underline"
              >
                info@somaliprocurementportal.com
              </a>
            </p>
            <p className="text-sm text-slate-300">Call: +252 63 000 0000</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Find</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/tenders" className="hover:text-brand-cyan">
                  Tenders
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-brand-cyan">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-brand-cyan">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/contact" className="hover:text-brand-cyan">
                  Contact
                </Link>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Terms of use
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Stay updated</h3>
            <p className="mt-4 text-sm text-slate-300">
              Mobile apps and newsletter — launching with the full release.
            </p>
          </div>
        </div>
        <Separator className="my-10 bg-slate-700" />
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-center text-xs text-slate-400 sm:text-left">
            © {new Date().getFullYear()} Somali Procurement Portal. All rights
            reserved
            <span className="text-slate-600"> | </span>
            Powered by{" "}
            <span className="font-medium text-brand-cyan">SPP Digital</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {social.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border border-slate-600 text-slate-300 transition-colors hover:border-brand-cyan/60 hover:text-brand-cyan"
                aria-label={label}
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
