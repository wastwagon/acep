"use client";

import type { ReactNode } from "react";

export type PlatformHeroProps = {
  /** Optional pill row (icon + label) above the title */
  badge?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
};

/**
 * Light editorial hero for vertical hubs (Electricity, Oil, Tax, Contracts, etc.)
 * — matches homepage / IEA template tokens (no full-bleed dark gradients).
 */
export function PlatformHero({ badge, title, description, actions }: PlatformHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#fafaf9]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-0 top-0 h-[min(52%,400px)] w-[min(50vw,520px)] bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.14),transparent_68%)]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-acep-primary/[0.06] blur-3xl" />
      </div>
      <div className="container relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16 md:py-20 lg:px-8">
        {badge ? (
          <div className="mb-6 flex justify-center">{badge}</div>
        ) : (
          <div className="mx-auto mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-acep-secondary sm:w-12" aria-hidden />
            <span className="h-px w-10 bg-acep-secondary sm:w-12" aria-hidden />
          </div>
        )}
        <h1 className="font-display text-balance text-3xl font-medium tracking-[-0.03em] text-slate-900 sm:text-4xl md:text-[2.65rem] md:leading-[1.08]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
        {actions ? <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
      </div>
    </section>
  );
}
