import { TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlatformHero } from "@/components/layout/platform-hero";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-sm font-semibold text-acep-primary shadow-sm backdrop-blur-sm";

const btnRound = "h-12 rounded-full px-8";

export function OilRevenueHero() {
  return (
    <PlatformHero
      badge={
        <span className={badgeClass}>
          <TrendingUp className="h-4 w-4 text-acep-secondary" aria-hidden />
          Ghana Oil Transparency Initiative
        </span>
      }
      title="Our Oil Money"
      description="Transparency in Ghana&apos;s oil revenue management—track revenue flows, projects, and how resources reach communities."
      actions={
        <>
          <Link
            href="/oil-revenue/resource-centre"
            className={cn(buttonVariants({ size: "lg", variant: "default" }), btnRound, "gap-2")}
          >
            <Download className="h-5 w-5" />
            Download data
          </Link>
          <Link
            href="/oil-revenue/projects"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), btnRound)}
          >
            View projects
          </Link>
        </>
      }
    />
  );
}
