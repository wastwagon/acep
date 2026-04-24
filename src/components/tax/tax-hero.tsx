import Link from "next/link";
import { Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlatformHero } from "@/components/layout/platform-hero";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-sm font-semibold text-acep-primary shadow-sm backdrop-blur-sm";

const btnRound = "h-12 rounded-full px-8 gap-2";

export function TaxHero() {
  return (
    <PlatformHero
      badge={
        <span className={badgeClass}>
          <Shield className="h-4 w-4 text-acep-secondary" aria-hidden />
          OpenTax platform
        </span>
      }
      title="Promoting tax transparency in Ghana"
      description="Track tax collections, report violations, and support accountability—with clear information and whistleblower protections."
      actions={
        <>
          <Link
            href="/tax/whistleblower"
            className={cn(buttonVariants({ size: "lg", variant: "default" }), btnRound)}
          >
            <AlertTriangle className="h-5 w-5" />
            Report a violation
          </Link>
          <Link
            href="/tax/revenue"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), btnRound)}
          >
            <TrendingUp className="h-5 w-5" />
            View tax revenue
          </Link>
        </>
      }
    />
  );
}
