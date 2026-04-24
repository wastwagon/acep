"use client";

import Link from "next/link";
import { AlertTriangle, Home, Library, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type ErrorFallbackUILayout = "embedded" | "fullscreen";

export type ErrorFallbackUIProps = {
  kicker: string;
  title: string;
  description: string;
  digest?: string;
  onReset: () => void;
  layout?: ErrorFallbackUILayout;
};

/**
 * Shared branded error panel for `error.tsx` and `global-error.tsx`.
 */
export function ErrorFallbackUI({
  kicker,
  title,
  description,
  digest,
  onReset,
  layout = "embedded",
}: ErrorFallbackUIProps) {
  const isFullscreen = layout === "fullscreen";

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:py-24",
        isFullscreen ? "flex min-h-screen flex-col" : "min-h-[60vh]",
      )}
    >
      <div
        className={cn(
          "w-full max-w-lg text-center",
          isFullscreen ? "m-auto" : "mx-auto",
        )}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
          <AlertTriangle className="h-8 w-8" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-800/90">{kicker}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-slate-600">{description}</p>
        {digest && (
          <p className="mt-3 font-mono text-xs text-slate-400" aria-live="polite">
            Reference: {digest}
          </p>
        )}
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-acep-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-acep-primary/90"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-acep-primary/30 hover:bg-slate-50"
          >
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <Link
            href="/publications"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-acep-primary/30 hover:bg-slate-50"
          >
            <Library className="h-4 w-4 text-acep-primary" aria-hidden />
            Publications
          </Link>
        </div>
      </div>
    </div>
  );
}
