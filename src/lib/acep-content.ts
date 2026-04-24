import * as cheerio from "cheerio";
import { transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";

/**
 * Extract the main content HTML from a scraped ACEP page snapshot.
 * - Rewrites wp-content/wp-includes paths to /acep-assets
 * - Removes scripts and theme chrome (header/footer)
 * - Returns HTML suitable for rendering inside our IEA templates
 */
export function extractAcepMainContentHtml(html: string): string {
  const body = transformAcepHtmlForLocalAssets(html, { extractBody: true });
  const $ = cheerio.load(body);

  // Remove ACEP theme chrome and common wrappers
  $("header.gm-navbar, header.default_header").remove();
  $("aside.gm-navigation-drawer, .gm-padding, .loader-wrap").remove();
  $("footer, .site-footer, .elementor-location-footer").remove();

  const root =
    $("#content").length ? $("#content") :
    $("main").length ? $("main") :
    $("body");

  // Avoid duplicate page title (we render it ourselves)
  root.find("h1").first().remove();

  return root.html() || "";
}

