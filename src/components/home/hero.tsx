import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const platformChips = [
  { label: "Contracts", href: "/contracts" },
  { label: "Electricity", href: "/electricity" },
  { label: "Oil revenue", href: "/oil-revenue" },
  { label: "OpenTax", href: "/tax" },
];

export function Hero() {
  return (
    <section className="relative z-0 overflow-hidden -mt-[6.5rem] bg-[#fafaf9] pt-[7.25rem] lg:-mt-[6.75rem] lg:pt-[8rem]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,rgba(250,250,249,0.96)_42%,rgba(30,58,138,0.035)_100%)]" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-acep-primary/[0.04] blur-3xl" />
        <div className="absolute right-0 top-0 h-[min(70%,520px)] w-[min(55vw,640px)] bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.14),transparent_65%)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-white sm:h-52"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8 lg:pb-28 lg:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
          {/* Copy column — deliberate vertical rhythm */}
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5 xl:col-span-5">
            <div className="mb-8 flex items-center gap-5">
              <span className="h-px w-12 shrink-0 bg-acep-secondary sm:w-16" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:text-[11px]">
                  Africa Centre for Energy Policy
                </p>
                <p className="mt-1 font-medium tracking-tight text-slate-800">Research · Advocacy · Transparency</p>
              </div>
            </div>

            <h1 className="font-display text-balance text-[2.125rem] font-medium leading-[1.06] tracking-[-0.03em] text-slate-900 sm:text-[2.5rem] lg:text-[2.65rem] xl:text-[3.15rem]">
              <span className="text-acep-primary">Transparent data</span>
              <span className="text-slate-900">
                {" "}
                and credible research for modern governance.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-[17px] leading-[1.65] text-slate-600 sm:text-lg">
              Evidence, monitoring, and clear public storytelling—so citizens and institutions can decide with
              confidence.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/publications"
                className="inline-flex h-12 items-center justify-center rounded-acepBtn bg-acep-primary px-8 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(30,58,138,0.55)] transition hover:bg-acep-primary/92 hover:shadow-[0_16px_44px_-14px_rgba(30,58,138,0.5)] sm:h-[3.25rem] sm:px-9"
              >
                Publications
                <ArrowRight className="ml-2 h-4 w-4 opacity-95" strokeWidth={2} />
              </Link>
              <Link
                href="/videos"
                className="inline-flex h-12 items-center justify-center rounded-acepBtn border border-slate-300/90 bg-white/80 px-8 text-sm font-semibold text-slate-800 backdrop-blur-sm transition hover:border-acep-primary/35 hover:text-acep-primary sm:h-[3.25rem] sm:px-9"
              >
                OilMoneyTV
              </Link>
            </div>

            <div className="mt-14 border-t border-slate-200/80 pt-9">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Data platforms</p>
              <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Platform shortcuts">
                {platformChips.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="group relative text-[13px] font-semibold text-slate-600 transition hover:text-acep-primary"
                  >
                    <span className="relative">
                      {chip.label}
                      <span
                        className="absolute -bottom-1 left-0 h-px w-0 bg-acep-secondary transition-all duration-300 group-hover:w-full"
                        aria-hidden
                      />
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Visual column — layered frame + cinematic crop */}
          <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7">
            <figure className="relative mx-auto max-w-lg lg:mx-0 lg:max-w-none">
              <div
                className="pointer-events-none absolute -right-2 -top-2 hidden h-[calc(100%+1.25rem)] w-[calc(100%+1.25rem)] rounded-acepCard border border-acep-primary/[0.12] sm:block lg:-right-4 lg:-top-4 lg:h-[calc(100%+2rem)] lg:w-[calc(100%+2rem)] lg:rounded-acepCard"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-acepCard bg-slate-200 shadow-[0_40px_100px_-48px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/[0.06]">
                <div className="group relative aspect-[5/4] w-full sm:aspect-[16/11] lg:aspect-[4/3] lg:min-h-[min(52vh,520px)] xl:min-h-[min(56vh,580px)]">
                  <Image
                    src="/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg"
                    alt="Energy infrastructure and extractive sector context in Ghana"
                    fill
                    className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                    <div className="max-w-xl border-l-2 border-acep-secondary pl-4 sm:pl-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100/95">Platforms</p>
                      <p className="mt-2 text-base font-medium leading-snug text-white sm:text-[17px]">
                        Contract, power, revenue, and tax tools built for everyday transparency.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href="/electricity"
                          className="rounded-acepBtn border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                        >
                          Electricity
                        </Link>
                        <Link
                          href="/oil-revenue"
                          className="rounded-acepBtn border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                        >
                          Oil revenue
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
