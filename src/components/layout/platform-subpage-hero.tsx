import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PlatformSubpageHeroProps = {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: string;
};

/**
 * Compact light header for hub subpages (replaces orange gradient band).
 */
export function PlatformSubpageHero({ backHref, backLabel, title, subtitle }: PlatformSubpageHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4 -ml-2 h-9 text-slate-600 hover:bg-slate-100 hover:text-acep-primary",
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Link>
        <h1 className="font-display text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{subtitle}</p> : null}
      </div>
    </section>
  );
}
