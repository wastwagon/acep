"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarNavProps {
  title: string;
  items: SidebarNavItem[];
  basePath: string;
  className?: string;
}

export function SidebarNav({ title, items, basePath, className }: SidebarNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const normalizedPath = pathname || "/";
    const normalizedHref = href === "/" ? "/" : href.replace(/\/$/, "");
    return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sticky top-[72px] z-40 border-b border-slate-200 bg-white lg:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full justify-between py-4"
          >
            <span className="font-semibold">{title} Menu</span>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium text-slate-900">{title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-acepBtn px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-acep-primary/10 text-acep-primary border-l-4 border-acep-primary"
                        : "text-slate-700 hover:bg-slate-50 hover:text-acep-primary"
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {active && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:block",
          className
        )}
      >
        <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-display text-lg font-medium text-slate-900">{title}</h2>
          </div>
          <nav className="p-4 space-y-1">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-acepBtn px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-acep-primary/10 text-acep-primary border-l-4 border-acep-primary"
                      : "text-slate-700 hover:bg-slate-50 hover:text-acep-primary"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {active && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
