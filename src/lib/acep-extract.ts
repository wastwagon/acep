import * as cheerio from "cheerio";

export type AcepListItem = {
  title: string;
  href: string;
  excerpt?: string;
  dateText?: string;
  imageSrc?: string;
};

export function acepHrefToLocalPath(href: string): string {
  const h = href.trim();
  if (!h) return "/";
  if (h.startsWith("/")) return h;
  try {
    const u = new URL(h);
    if (u.host === "acep.africa" || u.host === "www.acep.africa") return u.pathname;
    return h;
  } catch {
    return h;
  }
}

/**
 * Extract "card/list" items from an ACEP listing page snapshot.
 * This is intentionally tolerant: it tries several common WordPress/Elementor patterns.
 * It does NOT invent text; it only reads what's in the HTML.
 */
export function extractListingItems(html: string): AcepListItem[] {
  const $ = cheerio.load(html);

  // Prefer main content region if present
  const root =
    $("#content").length ? $("#content") :
    $("main").length ? $("main") :
    $("body");

  const items: AcepListItem[] = [];

  // Pattern 0: VanKine blog widget (blog_box)
  root.find(".blog_box").each((_i, el) => {
    const $el = $(el);
    const a = $el.find("h4.title_22 a, .title_22 a").first();
    const href = a.attr("href");
    const title = a.text().trim();
    if (!href || !title) return;

    const excerpt = $el.find("p.descs").first().text().trim() || undefined;
    const dateText = $el.find("time.date.published").first().text().trim() || 
                     $el.find(".date_tm time").first().text().trim() || undefined;
    const imageSrc = $el.find(".image_box img").first().attr("src") || undefined;

    items.push({ title, href, excerpt, dateText, imageSrc });
  });

  // Pattern 1: article h2/h3 + link
  if (items.length === 0) {
    root.find("article").each((_i, el) => {
      const $el = $(el);
      const a = $el.find("h2 a, h3 a, .entry-title a").first();
      const href = a.attr("href");
      const title = a.text().trim();
      if (!href || !title) return;

      const excerpt =
        $el.find(".entry-summary, .post-excerpt, .elementor-post__excerpt, p").first().text().trim() || undefined;

      const dateText =
        $el.find("time, .entry-date, .elementor-post-date").first().text().trim() || undefined;

      const imageSrc =
        $el.find("img").first().attr("src") || undefined;

      items.push({ title, href, excerpt, dateText, imageSrc });
    });
  }

  // Pattern 2: Elementor posts widget cards
  if (items.length === 0) {
    root.find(".elementor-post, .elementor-post__card, .elementor-posts-container .elementor-post").each((_i, el) => {
      const $el = $(el);
      const a = $el.find("a").first();
      const href = a.attr("href");
      const title =
        $el.find(".elementor-post__title, h3, h2").first().text().trim() ||
        a.text().trim();
      if (!href || !title) return;

      const excerpt =
        $el.find(".elementor-post__excerpt, .elementor-post__text p").first().text().trim() || undefined;
      const dateText =
        $el.find(".elementor-post-date, time").first().text().trim() || undefined;
      const imageSrc =
        $el.find("img").first().attr("src") || undefined;

      items.push({ title, href, excerpt, dateText, imageSrc });
    });
  }

  // De-dup by href
  const seen = new Set<string>();
  return items.filter((it) => {
    if (seen.has(it.href)) return false;
    seen.add(it.href);
    return true;
  });
}

