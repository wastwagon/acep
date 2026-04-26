import Link from "next/link";
import type { MarketingHubLink } from "@/lib/marketing-builtin";

type Props = {
  title: string;
  intro: string;
  links: MarketingHubLink[] | Readonly<MarketingHubLink[]>;
};

function HubCard({ link }: { link: { title: string; href: string; description: string; image: string } }) {
  return (
    <Link
      href={link.href}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-acepCard border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-shadow hover:border-acep-primary/35 hover:shadow-[0_6px_20px_-6px_rgba(15,23,42,0.1)]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 border-b border-slate-200/90 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={link.image} alt="" className="h-full w-full object-cover opacity-95 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-acep-primary sm:text-xl">
          {link.title}
        </h2>
        {link.description ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{link.description}</p>
        ) : (
          <div className="flex-1" />
        )}
        <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">{link.href}</p>
      </div>
    </Link>
  );
}

export function MarketingHubPage({ title, intro, links }: Props) {
  return (
    <div className="border-b border-slate-200/80 bg-white">
      <article className="page-shell">
        <header className="max-w-3xl border-b border-slate-100 pb-8 sm:pb-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-[17px]">{intro}</p> : null}
        </header>

        <section aria-label="Related pages" className="mt-10 sm:mt-12">
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {links.map((l) => (
              <HubCard key={l.href} link={l} />
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
