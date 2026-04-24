"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NavItemWithMega } from "@/components/layout/nav-config";
type MegaMenuPanelProps = {
  item: NavItemWithMega;
  onNavigate: () => void;
  isLinkActive: (href: string) => boolean;
  /** Stable id for `aria-controls` on nav triggers */
  id: string;
};

export function MegaMenuPanel({ item, onNavigate, isLinkActive, id }: MegaMenuPanelProps) {
  return (
    <div
      id={id}
      className="animate-in fade-in slide-in-from-top-1 border-t border-slate-100 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.2)] duration-200 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:duration-0"
      role="navigation"
      aria-label={`${item.name} mega menu`}
    >
      <div className="container mx-auto grid gap-8 px-4 py-8 sm:py-10 lg:grid-cols-12 lg:gap-10 lg:px-8">
        {/* Featured column */}
        <div className="lg:col-span-4">
          <Link
            href={item.coverHref}
            onClick={onNavigate}
            className="group relative block overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 ring-1 ring-black/[0.04] transition hover:ring-acep-primary/25"
          >
            <div className="relative aspect-[5/4] w-full sm:aspect-[4/3]">
              <Image
                src={item.coverImage}
                alt=""
                role="presentation"
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 28vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                  {item.coverEyebrow}
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">{item.name}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-white">
                  Explore overview
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Link grid */}
        <div className="max-h-[min(72vh,38rem)] overflow-y-auto overscroll-contain pr-1 lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">In this section</p>
              <p className="font-display text-lg font-medium tracking-[-0.02em] text-slate-900 sm:text-xl">
                Popular destinations
              </p>
            </div>
            {item.href !== "#" && (
              <Link
                href={item.href}
                onClick={onNavigate}
                className="text-sm font-semibold text-acep-primary hover:underline"
              >
                View all {item.name}
              </Link>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {item.submenu.map((sub) => {
              const isOn = isLinkActive(sub.href);
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={onNavigate}
                  className={[
                    "group flex gap-4 rounded-xl border p-3.5 transition",
                    isOn
                      ? "border-acep-primary/35 bg-acep-primary/[0.06] ring-1 ring-acep-primary/15"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md",
                  ].join(" ")}
                >
                  <div className="relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={sub.image}
                      alt=""
                      role="presentation"
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="120px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="font-semibold leading-snug text-slate-900">{sub.name}</p>
                    {sub.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{sub.description}</p>
                    )}
                  </div>
                  <ArrowRight
                    className={`mt-1 h-4 w-4 shrink-0 self-start transition sm:mt-2 ${
                      isOn ? "text-acep-primary" : "text-slate-300 group-hover:text-slate-600"
                    }`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
