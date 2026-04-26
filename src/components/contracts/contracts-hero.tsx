import { FileText, Download } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlatformHero } from "@/components/layout/platform-hero";

const badgeClass =
  "inline-flex items-center gap-2 rounded-acepBtn border border-slate-200/90 bg-white/95 px-4 py-2 text-sm font-semibold text-acep-primary shadow-sm backdrop-blur-sm";

const btnRound = "h-12 rounded-acepBtn px-8";

export function ContractsHero() {
  return (
    <PlatformHero
      badge={
        <span className={badgeClass}>
          <FileText className="h-4 w-4 text-acep-secondary" aria-hidden />
          Petroleum contract monitor
        </span>
      }
      title="Ghana Contract Monitor"
      description="Track petroleum contracts and agreements across Ghana&apos;s contract areas—with maps, documents, and structured data."
      actions={
        <>
          <Link
            href="/contracts"
            className={cn(buttonVariants({ size: "lg", variant: "default" }), btnRound, "gap-2")}
          >
            <Download className="h-5 w-5" />
            Browse contracts
          </Link>
          <Link
            href="/contracts#contract-areas-map"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), btnRound)}
          >
            View map
          </Link>
        </>
      }
    />
  );
}
