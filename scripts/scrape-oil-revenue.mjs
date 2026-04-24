/**
 * Scrape content from ouroilmoney.org
 * 
 * Extracts:
 * - All pages (Home, Revenue Overview, Projects, Resource Centre, Contact, Category pages)
 * - Revenue data and tables
 * - Project information
 * - Images and assets
 * - Design elements
 * 
 * Usage:
 *   node scripts/scrape-oil-revenue.mjs --out content/oil-revenue --concurrency 3
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const DEFAULT_OUT_DIR = "content/oil-revenue";
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_TIMEOUT_MS = 30_000;

// All pages from ouroilmoney.org
const OIL_REVENUE_PAGES = [
  { id: "home", url: "https://ouroilmoney.org/", name: "Home" },
  { id: "collection", url: "https://ouroilmoney.org/collection/", name: "Collection" },
  { id: "allocation", url: "https://ouroilmoney.org/allocation/", name: "Allocation" },
  { id: "management", url: "https://ouroilmoney.org/management/", name: "Management" },
  { id: "projects", url: "https://ouroilmoney.org/projects/", name: "Projects" },
  { id: "resource-centre", url: "https://ouroilmoney.org/resource-centre/", name: "Resource Centre" },
  { id: "contact", url: "https://ouroilmoney.org/contact-us-2/", name: "Contact Us" },
];

function parseArgs(argv) {
  const args = {
    out: DEFAULT_OUT_DIR,
    concurrency: DEFAULT_CONCURRENCY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    userAgent: "ACEP-Oil-Revenue-Scraper/1.0 (+https://acep.africa) - internal migration",
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--out" && next) args.out = next, i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--help") {
      console.log(`\nOil Revenue Scraper\n\nOptions:\n  --out <dir>\n  --concurrency <n>\n  --timeoutMs <ms>\n  --userAgent <ua>\n`);
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) args.concurrency = DEFAULT_CONCURRENCY;
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1_000) args.timeoutMs = DEFAULT_TIMEOUT_MS;
  return args;
}

async function fetchWithTimeout(url, opts = {}) {
  const { timeoutMs = 30_000, headers = {} } = opts;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": opts.userAgent || "ACEP-Scraper/1.0",
        ...headers,
      },
    });
    const buf = await res.arrayBuffer();
    clearTimeout(timeoutId);
    return { res, buf: Buffer.from(buf) };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

function extractPageData(html, pageName, url) {
  const $ = cheerio.load(html);
  const data = {
    url,
    title: $("title").text().trim(),
    statistics: {},
    revenueData: [],
    projects: [],
    content: {},
    images: [],
    assets: [],
  };

  // Extract statistics (from homepage)
  if (pageName === "Home") {
    // Extract key stats
    $("h1, h2, h3, .stat, .statistic, [class*='stat']").each((_, el) => {
      const text = $(el).text();
      // Look for revenue, production, projects, beneficiaries
      const revenueMatch = text.match(/(\$?[\d,]+\.?\d*)\s*B/i);
      const productionMatch = text.match(/([\d,]+)\s*Barrels/i);
      const projectsMatch = text.match(/([\d,]+)\s*Projects/i);
      const beneficiariesMatch = text.match(/([\d,]+\.?\d*)\s*M/i);
      
      if (revenueMatch && !data.statistics.totalRevenue) {
        data.statistics.totalRevenue = revenueMatch[1];
      }
      if (productionMatch && !data.statistics.production) {
        data.statistics.production = productionMatch[1];
      }
      if (projectsMatch && !data.statistics.projects) {
        data.statistics.projects = projectsMatch[1];
      }
      if (beneficiariesMatch && !data.statistics.beneficiaries) {
        data.statistics.beneficiaries = beneficiariesMatch[1];
      }
    });
  }

  // Extract revenue table data
  $("table").each((_, table) => {
    const rows = [];
    $(table).find("tr").each((_, tr) => {
      const cells = [];
      $(tr).find("td, th").each((_, td) => {
        cells.push($(td).text().trim());
      });
      if (cells.length > 0) rows.push(cells);
    });
    
    // Check if this looks like a revenue table
    const firstRow = rows[0] || [];
    if (firstRow.some(cell => cell.toLowerCase().includes("year") || 
                             cell.toLowerCase().includes("amount") ||
                             cell.toLowerCase().includes("revenue") ||
                             cell.toLowerCase().includes("category"))) {
      data.revenueData = rows;
    }
  });

  // Extract main content
  const mainContent = $("main, .content, #content, .entry-content, article, .page-content").first();
  if (mainContent.length) {
    data.content.html = mainContent.html() || "";
    data.content.text = mainContent.text().trim();
  } else {
    // Fallback: get body content
    data.content.html = $("body").html() || "";
    data.content.text = $("body").text().trim();
  }

  // Extract all images
  $("img").each((_, img) => {
    const src = $(img).attr("src");
    const srcset = $(img).attr("srcset");
    const alt = $(img).attr("alt") || "";
    if (src) {
      const imageUrl = src.startsWith("http") ? src : new URL(src, url).toString();
      data.images.push({
        src: imageUrl,
        srcset: srcset || null,
        alt: alt,
      });
    }
  });

  // Extract CSS and JS assets
  $("link[rel='stylesheet']").each((_, link) => {
    const href = $(link).attr("href");
    if (href) {
      const assetUrl = href.startsWith("http") ? href : new URL(href, url).toString();
      data.assets.push({ type: "css", url: assetUrl });
    }
  });

  $("script[src]").each((_, script) => {
    const src = $(script).attr("src");
    if (src) {
      const assetUrl = src.startsWith("http") ? src : new URL(src, url).toString();
      data.assets.push({ type: "js", url: assetUrl });
    }
  });

  return data;
}

async function main() {
  const args = parseArgs(process.argv);
  const outRoot = path.resolve(process.cwd(), args.out);
  await mkdir(outRoot, { recursive: true });
  await mkdir(path.join(outRoot, "snapshots"), { recursive: true });
  await mkdir(path.join(outRoot, "assets"), { recursive: true });

  console.log(`[oil-revenue-scraper] Starting scrape of ${OIL_REVENUE_PAGES.length} pages...`);
  console.log(`[oil-revenue-scraper] Output directory: ${outRoot}`);

  const pages = [];
  let i = 0;

  async function worker() {
    while (true) {
      const n = i++;
      if (n >= OIL_REVENUE_PAGES.length) return;
      
      const page = OIL_REVENUE_PAGES[n];
      console.log(`[oil-revenue-scraper] [${n + 1}/${OIL_REVENUE_PAGES.length}] Fetching: ${page.name}`);

      try {
        const { res, buf } = await fetchWithTimeout(page.url, {
          timeoutMs: args.timeoutMs,
          userAgent: args.userAgent,
        });

        if (res.status !== 200) {
          console.error(`[oil-revenue-scraper] ERROR ${page.url}: HTTP ${res.status}`);
          pages.push({
            id: page.id,
            name: page.name,
            url: page.url,
            status: res.status,
            error: `HTTP ${res.status}`,
          });
          continue;
        }

        const html = buf.toString("utf8");
        const pageData = extractPageData(html, page.name, page.url);

        // Save raw HTML
        const safeName = page.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const htmlPath = path.join(outRoot, "snapshots", `${safeName}.html`);
        await mkdir(path.dirname(htmlPath), { recursive: true });
        await writeFile(htmlPath, html);

        pages.push({
          id: page.id,
          name: page.name,
          url: page.url,
          status: 200,
          ...pageData,
          savedAs: path.relative(outRoot, htmlPath),
        });

        console.log(`[oil-revenue-scraper] ✓ Extracted: ${page.name}`);
        if (pageData.statistics && Object.keys(pageData.statistics).length > 0) {
          console.log(`   Statistics: ${Object.keys(pageData.statistics).length} items`);
        }
        if (pageData.revenueData.length > 0) {
          console.log(`   Revenue Data: ${pageData.revenueData.length} rows`);
        }
        if (pageData.images.length > 0) {
          console.log(`   Images: ${pageData.images.length}`);
        }

      } catch (err) {
        console.error(`[oil-revenue-scraper] ERROR ${page.url}: ${String(err?.message || err)}`);
        pages.push({
          id: page.id,
          name: page.name,
          url: page.url,
          status: "error",
          error: String(err?.message || err),
        });
      }
    }
  }

  // Run workers
  await Promise.all(Array.from({ length: args.concurrency }, () => worker()));

  // Sort by ID
  pages.sort((a, b) => (a.id || "").localeCompare(b.id || ""));

  // Save index
  const index = {
    source: {
      baseUrl: "https://ouroilmoney.org",
      scrapedAt: new Date().toISOString(),
      userAgent: args.userAgent,
    },
    totals: {
      pages: pages.length,
      successful: pages.filter(p => p.status === 200).length,
      errors: pages.filter(p => p.status !== 200).length,
    },
    pages,
  };

  const indexPath = path.join(outRoot, "index.json");
  await writeFile(indexPath, JSON.stringify(index, null, 2));

  console.log(`\n[oil-revenue-scraper] Done!`);
  console.log(`[oil-revenue-scraper] Saved index: ${indexPath}`);
  console.log(`[oil-revenue-scraper] Success: ${index.totals.successful}/${index.totals.pages}`);
  console.log(`[oil-revenue-scraper] Errors: ${index.totals.errors}/${index.totals.pages}`);

  // Generate TypeScript data file
  const tsPath = path.join(outRoot, "oil-revenue-data.ts");
  const tsContent = generateTypeScriptData(pages);
  await writeFile(tsPath, tsContent);
  console.log(`[oil-revenue-scraper] Generated TypeScript data: ${tsPath}`);
}

function generateTypeScriptData(pages) {
  const successful = pages.filter(p => p.status === 200);
  
  return `// Auto-generated oil revenue data from ouroilmoney.org
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - Run: node scripts/scrape-oil-revenue.mjs

export interface OilRevenuePage {
  id: string;
  name: string;
  url: string;
  title?: string;
  statistics?: {
    totalRevenue?: string;
    production?: string;
    projects?: string;
    beneficiaries?: string;
  };
  revenueData?: string[][];
  projects?: any[];
  content?: {
    html?: string;
    text?: string;
  };
  images?: Array<{
    src: string;
    srcset?: string | null;
    alt: string;
  }>;
  assets?: Array<{
    type: string;
    url: string;
  }>;
}

export const oilRevenuePages: OilRevenuePage[] = ${JSON.stringify(successful.map(p => ({
    id: p.id,
    name: p.name,
    url: p.url,
    title: p.title,
    statistics: p.statistics,
    revenueData: p.revenueData,
    content: p.content ? { text: p.content.text?.substring(0, 1000) } : undefined,
    images: p.images,
    assets: p.assets,
  })), null, 2)};
`;
}

main().catch((e) => {
  console.error(`[oil-revenue-scraper] Fatal: ${e?.stack || e}`);
  process.exit(1);
});
