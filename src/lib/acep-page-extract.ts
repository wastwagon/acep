import * as cheerio from "cheerio";

export type AcepPageIntro = {
  title?: string;
  intro?: string;
  heroImage?: string;
};

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Extract a simple page title + intro paragraph + first image (if present)
 * from the scraped HTML. No rewriting, no new copy.
 */
export function extractPageIntro(html: string): AcepPageIntro {
  const $ = cheerio.load(html);

  const main =
    $("#content").length ? $("#content") :
    $("main").length ? $("main") :
    $("body");

  const title =
    cleanText(main.find("h1").first().text()) ||
    cleanText($("title").first().text()) ||
    undefined;

  // Find first meaningful paragraph
  let intro: string | undefined;
  main.find("p").each((_i, el) => {
    const t = cleanText($(el).text());
    if (t && t.length >= 40) {
      intro = t;
      return false;
    }
    return;
  });

  const heroImage =
    main.find("img").first().attr("src") ||
    undefined;

  return { title, intro, heroImage };
}

