import { Zap, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlatformHero } from "@/components/layout/platform-hero";

const badgeClass =
  "inline-flex items-center gap-2 rounded-acepBtn border border-slate-200/90 bg-white/95 px-4 py-2 text-sm font-semibold text-acep-primary shadow-sm backdrop-blur-sm";

const btnRound = "h-12 rounded-acepBtn px-8";

export function ElectricityHero() {
  return (
    <PlatformHero
      badge={
        <span className={badgeClass}>
          <Zap className="h-4 w-4 text-acep-secondary" aria-hidden />
          Electricity Monitor
        </span>
      }
      title={"ACEP's Electricity Monitor"}
      description="Track and engage with Ghana&apos;s power sector—generation, transmission, distribution—and report electricity issues in your area."
      actions={
        <>
          <Link
            href="/electricity/report-challenge"
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }), btnRound, "gap-2")}
          >
            <AlertTriangle className="h-5 w-5" />
            Report an issue
          </Link>
          <Link
            href="/electricity/generation"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), btnRound)}
          >
            View power plants
          </Link>
        </>
      }
    />
  );
}
