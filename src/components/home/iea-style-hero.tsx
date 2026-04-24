import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Alternate landing hero — matches the light ACEP editorial system
 * (same tokens as homepage; safe if wired into a template route later).
 */
export function IEAHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#fafaf9]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-0 top-0 h-[min(60%,420px)] w-[min(50vw,520px)] bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-acep-primary/[0.05] blur-3xl" />
      </div>
      <div className="container relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-12 shrink-0 bg-acep-secondary sm:w-14" aria-hidden />
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500 sm:text-[11px]">
            Africa Centre for Energy Policy
          </p>
        </div>
        <h1 className="font-display text-balance text-[2.25rem] font-medium leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-[2.75rem]">
          <span className="text-acep-primary">Shaping a transparent</span> and accountable energy future for Africa.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          Authoritative analysis, data, and policy recommendations—supporting transparency and accountability in
          Africa&apos;s energy sector.
        </p>
        <div className="mt-10">
          <Link
            href="/about-us"
            className="inline-flex h-12 items-center rounded-full bg-acep-primary px-8 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(30,58,138,0.5)] transition hover:bg-acep-primary/90"
          >
            Learn more about our mission
            <ArrowRight className="ml-2 h-4 w-4 opacity-95" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
