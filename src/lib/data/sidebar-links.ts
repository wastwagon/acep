// Shared sidebar links for Resource Centre pages
// This ensures consistency across all pages that use Resource Centre navigation

import { getMainCategory } from "./categories";

export interface SidebarLink {
  title: string;
  href: string;
}

export const RESOURCE_CENTRE_SIDEBAR_LINKS: SidebarLink[] = [
  { title: "Publications", href: "/publications" },
  { title: "Photo Gallery", href: "/photo-gallery" },
  { title: "Video Gallery", href: "/video-gallery" },
];

export type BackNavigation = {
  link: string;
  text: string;
  /** Short label for breadcrumbs (no “Back to” prefix) */
  breadcrumbLabel: string;
};

/**
 * Listing parent for snapshot / publication detail pages, from URL, WordPress category, and title.
 */
export function getBackNavigation(
  url: string,
  category?: string,
  title?: string
): BackNavigation {
  const main = getMainCategory(category, title, url);
  const urlLower = url.toLowerCase();

  const annualReports: BackNavigation = {
    link: "/annual-reports",
    text: "Back to Annual Reports",
    breadcrumbLabel: "Annual Reports",
  };
  const reportsHub: BackNavigation = {
    link: "/reports",
    text: "Back to Reports",
    breadcrumbLabel: "Reports",
  };

  const byMain: Record<string, BackNavigation> = {
    "Research & Policy Papers": {
      link: "/research-and-policy-papers",
      text: "Back to Research & Policy Papers",
      breadcrumbLabel: "Research & Policy Papers",
    },
    "Policy Briefs": {
      link: "/publications",
      text: "Back to Publications",
      breadcrumbLabel: "Publications",
    },
    "Reports":
      urlLower.includes("/annual") || urlLower.includes("annual-report")
        ? annualReports
        : reportsHub,
    "Press Statements": {
      link: "/press-statements",
      text: "Back to Press Statements",
      breadcrumbLabel: "Press Statements",
    },
    "News & Blog Posts": {
      link: "/news-blog-posts",
      text: "Back to News & Blog",
      breadcrumbLabel: "News & Blog",
    },
    "ACEP Radar": {
      link: "/radar",
      text: "Back to ACEP Radar",
      breadcrumbLabel: "ACEP Radar",
    },
  };

  const resolved = byMain[main];
  if (resolved) return resolved;

  return {
    link: "/publications",
    text: "Back to Publications",
    breadcrumbLabel: "Publications",
  };
}
