import Link from "next/link";
import type { ReactNode } from "react";
import type { ResolvedProsePage } from "@/lib/resolve-marketing-content";

const aboutRail = [
  { title: "About Us", href: "/about-us" },
  { title: "The Organisation", href: "/the-organisation" },
  { title: "Governing Board", href: "/governing-board" },
  { title: "Our Team", href: "/team" },
  { title: "Our Partners", href: "/our-partners" },
] as const;

const programsRail = [
  { title: "Events / Knowledge platforms", href: "/programs" },
  { title: "Events", href: "/events" },
  { title: "NextGen", href: "/nextgen10" },
  { title: "Africa Climate Academy", href: "/climate-academy" },
  { title: "AFREIKH Summer School", href: "/2025-afreikh-summer-school" },
  { title: "Resource Governance Campus Hub", href: "/rgchub" },
] as const;

const fecRail = [
  { title: "Brochure", href: "/fec-brochure" },
  { title: "FEC Resource Centre", href: "/fec-resource-centre" },
  { title: "Programs", href: "/programs" },
] as const;

type Aside = "about" | "programs" | "fec" | "none";

type Props = ResolvedProsePage & { aside?: Aside; belowHero?: ReactNode };

export function MarketingProsePage({ title, intro, heroImage, contentHtml, aside = "none", belowHero }: Props) {
  const rail = aside === "about" ? aboutRail : aside === "programs" ? programsRail : aside === "fec" ? fecRail : null;

  return (
    <div className="border-b border-slate-200/80 bg-white">
      <article className="page-shell">
        <header className="max-w-3xl border-b border-slate-100 pb-8 sm:pb-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-4 text-base leading-7 text-slate-600 sm:text-[17px]">{intro}</p> : null}
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            {heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt=""
                className="w-full rounded-acepCard border border-slate-200/90 bg-slate-50 shadow-sm"
              />
            )}
            {belowHero}
            <div className="mt-8 rounded-acepCard border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
              <div className="acep-rich max-w-none text-slate-800 [&_a]:text-acep-primary [&_a]:underline-offset-2 hover:[&_a]:underline" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </div>

          {rail && (
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-acepCard border border-slate-200/90 bg-slate-50/80 p-5 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900 mb-3">
                    {aside === "about" ? "About" : aside === "fec" ? "FEC" : "Programs"}
                  </div>
                  <div className="space-y-2 text-sm">
                    {rail.map((l) => (
                      <Link key={l.href} className="block text-slate-700 hover:text-acep-primary" href={l.href}>
                        {l.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
