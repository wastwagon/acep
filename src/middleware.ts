import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACEP_PATHS } from "@/lib/acep-route-map";

// Keep this list tight: anything not matched here can be routed to ACEP snapshots.
// We distinguish between:
// - prefix-reserved: protect entire subtree (e.g. /_next, /contracts/*)
// - exact-reserved: protect only the exact route, but allow subpaths to fall back to snapshots
//   (e.g. /press-statements/page/2 should be an ACEP snapshot)
const RESERVED_PREFIXES = [
  "/_next/",
  "/api/",
  "/acep/",
  "/acep-assets/",
  "/contracts",
  "/electricity",
  "/oil-revenue",
  "/videos",
];

const RESERVED_EXACT = [
  // IEA-style template pages (exact only; subpaths may exist on ACEP and should fall back)
  "/research-and-policy-papers",
  "/press-statements",
  "/news-blog-posts",
  "/radar",
  "/annual-reports",
  "/resource-centre",
  "/programs",
  "/events",
  "/about-us",
  "/photo-gallery",
  "/video-gallery",
  "/fec-2025",
  "/fec-brochure",
  "/fec-resource-centre",
  "/eiccg-fund",
  "/the-organisation",
  "/governing-board",
  "/team",
  "/our-partners",
  "/nextgen10",
  "/climate-academy",
  "/2025-afreikh-summer-school",
  "/rgchub",
];

function isReserved(pathname: string): boolean {
  const prefixReserved = RESERVED_PREFIXES.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname === p || pathname.startsWith(`${p}/`)
  );
  if (prefixReserved) return true;
  return RESERVED_EXACT.some((p) => pathname === p || pathname === `${p}/`);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /posts/* -> /publications/* (canonical route; breadcrumbs and URL alignment)
  if (pathname === "/posts" || pathname === "/posts/") {
    const url = req.nextUrl.clone();
    url.pathname = "/publications";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/posts/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/publications" + pathname.slice("/posts".length);
    return NextResponse.redirect(url);
  }

  // Legacy/alias paths (some appear in ACEP homepage quick links)
  // Redirect to our canonical IEA-template routes for a better UX.
  const legacyRedirects: Record<string, string> = {
    "/blog/": "/resource-centre",
    "/blog": "/resource-centre",
    "/blogs-news/": "/news-blog-posts",
    "/blogs-news": "/news-blog-posts",
    "/our-press-statements/": "/press-statements",
    "/our-press-statements": "/press-statements",
    "/our-events/": "/events",
    "/our-events": "/events",
    // These URLs currently return 404 on source, but are linked from the homepage.
    "/our-reports/": "/resource-centre",
    "/our-reports": "/resource-centre",
    "/nextgen5/": "/programs",
    "/nextgen5": "/programs",
  };
  const redirectTo = legacyRedirects[pathname];
  if (redirectTo) {
    const url = req.nextUrl.clone();
    url.pathname = redirectTo;
    return NextResponse.redirect(url);
  }

  // Serve WP static asset paths at root too (common in scraped HTML)
  if (pathname.startsWith("/wp-content/") || pathname.startsWith("/wp-includes/")) {
    const url = req.nextUrl.clone();
    url.pathname = `/acep-assets${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Do not interfere with our core routes and Next internals
  if (isReserved(pathname)) return NextResponse.next();

  // Normalize trailing slash
  const normalized = pathname === "/" ? "/" : (pathname.endsWith("/") ? pathname : `${pathname}/`);

  // If this path exists on ACEP, rewrite to snapshot renderer.
  if (normalized !== "/" && ACEP_PATHS.has(normalized)) {
    const url = req.nextUrl.clone();
    url.pathname = `/acep${normalized}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"], // ignore file extensions; we handle wp-content/wp-includes explicitly above
};

