import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, Phone, LogIn } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const TEL_DISPLAY = "(+233) 302 900 730";
const TEL_HREF = "tel:+233302900730";

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/ACEPGhana", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/ACEPGhana", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/acep-ghana", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@oilmoneytv", icon: Youtube },
] as const;

export function SiteTopBar() {
  return (
    <div className="border-b border-slate-200/90 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-2.5 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <a
            href={TEL_HREF}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-700 transition hover:text-acep-primary sm:text-[13px]"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-acep-secondary" aria-hidden />
            {TEL_DISPLAY}
          </a>
          <div className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
          <div className="flex items-center gap-0.5">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-acep-primary/5 hover:text-acep-primary"
                aria-label={name}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-acep-primary/35 hover:text-acep-primary sm:h-10 sm:text-[13px]"
          >
            <LogIn className="h-3.5 w-3.5 shrink-0 text-slate-500 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
