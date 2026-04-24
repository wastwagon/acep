"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  RESOURCE_CENTRE_SIDEBAR_LINKS,
  type SidebarLink,
} from "@/lib/data/sidebar-links";
import { cn } from "@/lib/utils";

function pathMatchesHref(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

function isPublicationHubPath(pathname: string): boolean {
  return (
    pathname.startsWith("/publications") ||
    pathname.startsWith("/acep/") ||
    pathname.startsWith("/library/document/")
  );
}

export type ResourceCentreSidebarVariant = "card" | "listing";

type ResourceCentreSidebarProps = {
  links?: SidebarLink[];
  /** Default: Resource Centre links from `sidebar-links`. */
  variant?: ResourceCentreSidebarVariant;
  className?: string;
};

/**
 * Shared “Resource Centre” quick links with active state from the current URL.
 */
export function ResourceCentreSidebar({
  links,
  variant = "card",
  className,
}: ResourceCentreSidebarProps) {
  const pathname = usePathname() ?? "";
  const items = links ?? RESOURCE_CENTRE_SIDEBAR_LINKS;

  const linkActive = (href: string) => {
    if (href === "/publications" && isPublicationHubPath(pathname)) return true;
    return pathMatchesHref(pathname, href);
  };

  const inner = (
    <>
      <h3
        className={cn(
          "mb-4 text-slate-900",
          variant === "listing"
            ? "text-sm font-bold uppercase tracking-wide"
            : "text-sm font-semibold",
        )}
      >
        Resource Centre
      </h3>
      <nav aria-label="Resource centre">
        <ul className="space-y-2 text-sm">
          {items.map((link) => {
            const active = linkActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-md py-1.5 transition-colors",
                    variant === "listing" && "px-1 -mx-1",
                    variant === "card" && "px-2 -mx-2",
                    active
                      ? "bg-acep-primary/10 font-semibold text-acep-primary"
                      : "text-slate-700 hover:text-acep-primary",
                    variant === "listing" && !active && "hover:pl-2",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  if (variant === "listing") {
    return (
      <div
        className={cn(
          "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
          className,
        )}
      >
        {inner}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">{inner}</CardContent>
    </Card>
  );
}
