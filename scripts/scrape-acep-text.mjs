/**
 * Scrape *text* from one or more ACEP (WordPress) URLs — no images.
 * Output is for pasting into the admin CMS; add images in /admin/media and posts.
 *
 * Usage:
 *   node scripts/scrape-acep-text.mjs
 *   node scripts/scrape-acep-text.mjs --url https://acep.africa/future-of-energy-conference/
 *   node scripts/scrape-acep-text.mjs --url https://a.com/1/ --url https://a.com/2/
 *   node scripts/scrape-acep-text.mjs --out content/acep-text
 *   node scripts/scrape-acep-text.mjs --allow-host example.com
 *
 * Files per page (under --out/<slug>/):
 *   - content.md   — suggested markdown body (headings, paragraphs, lists)
 *   - meta.json    — title, slug, excerpt, sourceUrl, scrapedAt, cmsHint
 *   - plain.txt    — fallback one-column text dump
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const DEFAULT_OUT = "content/acep-text";
const DEFAULT_URLS = [
  "https://acep.africa/",
  "https://acep.africa/future-of-energy-conference/",
  "https://acep.africa/fec-2026-registration/",
];
const DEFAULT_UA = "ACEP-Text-Scrape/1.0 (+https://acep.africa) migration-to-cms";
const TIMEOUT_MS = 45_000;

function parseArgs(argv) {
  const out = { urls: [], outDir: DEFAULT_OUT, allowHosts: new Set(["acep.africa", "www.acep.africa"]) };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const n = argv[i + 1];
    if (a === "--out" && n) {
      out.outDir = n;
      i += 1;
    } else if (a === "--url" && n) {
      out.urls.push(n);
      i += 1;
    } else if (a === "--allow-host" && n) {
      out.allowHosts.add(n.toLowerCase().replace(/^www\./, ""));
      i += 1;
    } else if (a === "--help") {
      // eslint-disable-next-line no-console
      console.log(`\nacep text scrape: --out dir --url URL (repeat)  |  default URLs: home, FEC, registration\n`);
      process.exit(0);
    }
  }
  if (!out.urls.length) out.urls = DEFAULT_URLS;
  return out;
}

function isAllowedUrl(urlString, allowHosts) {
  let u;
  try {
    u = new URL(urlString);
  } catch {
    return false;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const h = u.hostname.toLowerCase().replace(/^www\./, "");
  return allowHosts.has(h);
}

function pathSlugFromUrl(urlString) {
  const u = new URL(urlString);
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "home";
  return parts.map((p) => p.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase()).join("__");
}

function stripThemeChrome($) {
  $(
    "header,footer,script,style,noscript,iframe,svg,nav,aside, .site-header, .site-footer, .gm-navbar, .gm-navigation-drawer, .gm-padding, .loader-wrap, [role=navigation], .wp-block-embed, .sharedaddy, .jp-relatedposts, #comments, .comment-respond, .elementor-location-header, .elementor-location-footer, form, button"
  ).remove();
}

/**
 * @returns {import("cheerio").Cheerio<import("cheerio").Element>}
 */
function findMain($) {
  const selectors = [
    ".entry-content",
    ".elementor-widget-theme-post-content .elementor-widget-container",
    ".elementor-widget-text-editor .elementor-widget-container",
    "article .post-content",
    "main article .post-inner",
    "#content .content-area",
    "main .site-main",
    "#content",
    "main article",
    "main",
  ];
  for (const sel of selectors) {
    const f = $(sel).first();
    if (f.length) return f;
  }
  return $("body");
}

/**
 * @param {import("cheerio").CheerioAPI} $
 * @param {import("cheerio").Cheerio<import("cheerio").Element>} $main
 */
function toMarkdownish($, $main) {
  const clone = $main.clone();
  clone.find("img, figure, picture, source, video, audio, object, embed").remove();
  const lines = [];
  const push = (s) => {
    const t = s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    if (!t) return;
    lines.push(t);
  };

  clone.find("h1,h2,h3,h4,h5,h6,p,li,blockquote,pre").each((_, el) => {
    const n = el.tagName && el.tagName.toLowerCase();
    if (!n) return;
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (!t) return;
    if (n === "h1" || n === "h2" || n === "h3" || n === "h4" || n === "h5" || n === "h6") {
      const level = +n[1] || 2;
      const hashes = Math.min(6, level);
      push("#".repeat(hashes) + " " + t);
    } else if (n === "p") push(t + "\n");
    else if (n === "li") push(`- ${t}`);
    else if (n === "blockquote") push(`> ${t}`);
    else if (n === "pre") push("```\n" + t + "\n```");
  });

  if (lines.length < 2) {
    // Fallback: divs with class elementor elementor text
    clone
      .find("div")
      .each((_, el) => {
        const t = $(el)
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim();
        if (t && t.length > 40) push(t);
      });
  }

  if (lines.length < 2) {
    return clone.text().replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim();
  }
  return lines.join("\n\n");
}

/**
 * @param {import("cheerio").CheerioAPI} $
 */
function pageTitle($) {
  return (
    $('meta[property="og:title"]').attr("content")?.trim() ||
    $('meta[name="twitter:title"]').attr("content")?.trim() ||
    $("h1").first().text().replace(/\s+/g, " ").trim() ||
    $("title")
      .text()
      .replace(/\s*[-|]\s*.*$/, "")
      .trim() ||
    "Untitled"
  );
}

/**
 * @param {import("cheerio").CheerioAPI} $
 */
function excerpt($, $main) {
  const m =
    $('meta[property="og:description"]').attr("content")?.trim() ||
    $('meta[name="description"]').attr("content")?.trim() ||
    $(".entry-content p, .entry-summary p, main p")
      .first()
      .text()
      .trim() ||
    $main.find("p").first().text().replace(/\s+/g, " ").trim();
  if (!m) return "";
  return m.length > 500 ? m.slice(0, 497) + "…" : m;
}

async function fetchHtml(url) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: "follow", signal: c.signal, headers: { "user-agent": DEFAULT_UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const outRoot = path.resolve(process.cwd(), args.outDir);
  await mkdir(outRoot, { recursive: true });

  for (const url of args.urls) {
    if (!isAllowedUrl(url, args.allowHosts)) {
      console.error(`[skip] host not allowed: ${url} (use --allow-host your.domain)`);
      // eslint-disable-next-line no-continue
      continue;
    }
    const slug = pathSlugFromUrl(url);
    const pageDir = path.join(outRoot, slug);
    await mkdir(pageDir, { recursive: true });
    // eslint-disable-next-line no-console
    console.log(`[fetch] ${url} -> ${path.relative(process.cwd(), pageDir)}/`);
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    stripThemeChrome($);
    const $main = findMain($);
    const title = pageTitle($);
    const ex = excerpt($, $main);
    const bodyMd = toMarkdownish($, $main);
    const plain = $main
      .clone()
      .find("img,figure,script,style")
      .remove()
      .end()
      .text()
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const meta = {
      title,
      suggestedSlug: slug.replace(/__+/g, "-"),
      sourceUrl: url,
      excerpt: ex,
      scrapedAt: new Date().toISOString(),
      cmsHint: "Add featured image and in-body images via Admin → Media, then insert in the post or content block.",
    };

    await writeFile(path.join(pageDir, "content.md"), `# ${title}\n\n${bodyMd}\n`, "utf8");
    await writeFile(
      path.join(pageDir, "meta.json"),
      JSON.stringify(meta, null, 2) + "\n",
      "utf8"
    );
    await writeFile(
      path.join(pageDir, "plain.txt"),
      `${title}\n\n${"=".repeat(40)}\n\n${plain}\n`,
      "utf8"
    );
  }
  // eslint-disable-next-line no-console
  console.log(`[done] wrote to ${outRoot} — copy from content.md or plain.txt into CMS, images separately.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
