import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Use "light" on dark hero (white text); "dark" on light background */
  variant?: "light" | "dark";
  className?: string;
}

export function Breadcrumbs({
  items,
  variant = "light",
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const isLight = variant === "light";
  const linkCls = isLight
    ? "text-white/80 hover:text-white transition-colors"
    : "text-slate-600 hover:text-acep-primary transition-colors";
  const currentCls = isLight ? "text-white font-medium" : "text-slate-900 font-medium";
  const sepCls = isLight ? "text-white/50" : "text-slate-400";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1 text-sm", className)}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                className={cn("h-4 w-4 flex-shrink-0", sepCls)}
                aria-hidden
              />
            )}
            {isLast || !item.href ? (
              <span className={cn(currentCls)}>{item.label}</span>
            ) : (
              <Link href={item.href} className={cn(linkCls, "hover:underline")}>
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
