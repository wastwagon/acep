/**
 * Scrape content from electricitymonitorgh.com
 * 
 * Extracts:
 * - All pages (Home, Generation, Transmission, Distribution, Access, Consumption, Reported Challenges)
 * - Power plants table data
 * - Statistics
 * - Images and assets
 * - Design elements
 * 
 * Usage:
 *   node scripts/scrape-electricity-monitor.mjs --out content/electricity-monitor
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const DEFAULT_OUT_DIR = "content/electricity-monitor";
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_TIMEOUT_MS = 30_000;

// All pages from electricitymonitorgh.com
const ELECTRICITY_PAGES = [
  { id: "home", url: "https://electricitymonitorgh.com/", name: "Home" },
  { id: "generation", url: "https://electricitymonitorgh.com/generation/", name: "Generation" },
  { id: "transmission", url: "https://electricitymonitorgh.com/transmission/", name: "Transmission" },
  { id: "distribution", url: "https://electricitymonitorgh.com/distribution-2/", name: "Distribution" },
  { id: "distribution-northern", url: "https://electricitymonitorgh.com/electricity-distribution-in-the-northern-zone/", name: "Distribution - Northern Zone" },
  { id: "distribution-southern", url: "https://electricitymonitorgh.com/electricity-distribution-in-the-southern-zone/", name: "Distribution - Southern Zone" },
  { id: "access", url: "https://electricitymonitorgh.com/access/", name: "Access" },
  { id: "consumption", url: "https://electricitymonitorgh.com/consumption/", name: "Consumption" },
  { id: "reported-challenges", url: "https://electricitymonitorgh.com/reported-challenges/", name: "Reported Challenges" },
  { id: "report-challenge", url: "https://electricitymonitorgh.com/report-a-challenge/", name: "Report a Challenge" },
];

function parseArgs(argv) {
  const args = {
    out: DEFAULT_OUT_DIR,
    concurrency: DEFAULT_CONCURRENCY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    userAgent: "ACEP-Electricity-Scraper/1.0 (+https://acep.africa) - internal migration",
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--out" && next) args.out = next, i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--help") {
      console.log(`\nElectricity Monitor Scraper\n\nOptions:\n  --out <dir>\n  --concurrency <n>\n  --timeoutMs <ms>\n  --userAgent <ua>\n`);
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
    powerPlants: [],
    content: {},
    images: [],
    assets: [],
  };

  // Extract statistics (from homepage)
  if (pageName === "Home") {
    // National, Rural, Urban access percentages
    $("p, div, span").each((_, el) => {
      const text = $(el).text();
      const nationalMatch = text.match(/National:\s*([0-9.]+)%/i);
      const ruralMatch = text.match(/Rural:\s*([0-9.]+)%/i);
      const urbanMatch = text.match(/Urban:\s*([0-9.]+)%/i);
      
      if (nationalMatch) data.statistics.nationalAccess = parseFloat(nationalMatch[1]);
      if (ruralMatch) data.statistics.ruralAccess = parseFloat(ruralMatch[1]);
      if (urbanMatch) data.statistics.urbanAccess = parseFloat(urbanMatch[1]);
    });
  }

  // Extract power plants table - check for DataTable AJAX endpoint
  const tableAjaxMatch = html.match(/ajax["']:\s*\{[^}]*url["']:\s*["']([^"']+)["']/);
  if (tableAjaxMatch && tableAjaxMatch[1].includes("get_wdtable")) {
    // Try to fetch table data via AJAX
    try {
      const ajaxUrl = tableAjaxMatch[1];
      const tableIdMatch = html.match(/table_id["']:\s*["']?(\d+)/);
      if (tableIdMatch) {
        const tableId = tableIdMatch[1];
        // Store AJAX endpoint for later fetching
        data.tableAjaxUrl = ajaxUrl;
        data.tableId = tableId;
      }
    } catch (e) {
      // Ignore AJAX fetch errors
    }
  }
  
  // Also try to extract from static table if present
  $("table").each((_, table) => {
    const rows = [];
    $(table).find("tr").each((_, tr) => {
      const cells = [];
      $(tr).find("td, th").each((_, td) => {
        cells.push($(td).text().trim());
      });
      if (cells.length > 0) rows.push(cells);
    });
    
    // Check if this looks like the power plants table
    const firstRow = rows[0] || [];
    if (firstRow.some(cell => cell.toLowerCase().includes("power station") || 
                             cell.toLowerCase().includes("installed capacity") ||
                             cell.toLowerCase().includes("dependable capacity"))) {
      data.powerPlants = rows;
    }
  });
  
  // Extract from DataTable configuration JSON
  const tableDescMatch = html.match(/id="table_\d+_desc"[^>]*value=['"]([^'"]+)['"]/);
  if (tableDescMatch) {
    try {
      const tableConfig = JSON.parse(decodeURIComponent(tableDescMatch[1]));
      // Extract possible values from advanced filter options
      if (tableConfig.advancedFilterOptions?.aoColumns) {
        const powerStationsColumn = tableConfig.advancedFilterOptions.aoColumns.find(
          col => col.origHeader === "powerstations" || col.displayHeader === "Power Stations"
        );
        if (powerStationsColumn?.values) {
          data.powerPlantNames = powerStationsColumn.values.map(v => v.value || v.label);
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  // Extract main content
  const mainContent = $("main, .content, #content, .entry-content, article").first();
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

  console.log(`[electricity-scraper] Starting scrape of ${ELECTRICITY_PAGES.length} pages...`);
  console.log(`[electricity-scraper] Output directory: ${outRoot}`);

  const pages = [];
  let i = 0;

  async function worker() {
    while (true) {
      const n = i++;
      if (n >= ELECTRICITY_PAGES.length) return;
      
      const page = ELECTRICITY_PAGES[n];
      console.log(`[electricity-scraper] [${n + 1}/${ELECTRICITY_PAGES.length}] Fetching: ${page.name}`);

      try {
        const { res, buf } = await fetchWithTimeout(page.url, {
          timeoutMs: args.timeoutMs,
          userAgent: args.userAgent,
        });

        if (res.status !== 200) {
          console.error(`[electricity-scraper] ERROR ${page.url}: HTTP ${res.status}`);
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

        console.log(`[electricity-scraper] ✓ Extracted: ${page.name}`);
        if (pageData.statistics && Object.keys(pageData.statistics).length > 0) {
          console.log(`   Statistics: ${Object.keys(pageData.statistics).length} items`);
        }
        if (pageData.powerPlants.length > 0) {
          console.log(`   Power Plants: ${pageData.powerPlants.length} rows`);
        }
        if (pageData.images.length > 0) {
          console.log(`   Images: ${pageData.images.length}`);
        }

      } catch (err) {
        console.error(`[electricity-scraper] ERROR ${page.url}: ${String(err?.message || err)}`);
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
      baseUrl: "https://electricitymonitorgh.com",
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

  console.log(`\n[electricity-scraper] Done!`);
  console.log(`[electricity-scraper] Saved index: ${indexPath}`);
  console.log(`[electricity-scraper] Success: ${index.totals.successful}/${index.totals.pages}`);
  console.log(`[electricity-scraper] Errors: ${index.totals.errors}/${index.totals.pages}`);

  // Generate TypeScript data file
  const tsPath = path.join(outRoot, "electricity-data.ts");
  const tsContent = generateTypeScriptData(pages);
  await writeFile(tsPath, tsContent);
  console.log(`[electricity-scraper] Generated TypeScript data: ${tsPath}`);
}

function generateTypeScriptData(pages) {
  const successful = pages.filter(p => p.status === 200);
  
  return `// Auto-generated electricity monitor data from electricitymonitorgh.com
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - Run: node scripts/scrape-electricity-monitor.mjs

export interface ElectricityPage {
  id: string;
  name: string;
  url: string;
  title?: string;
  statistics?: {
    nationalAccess?: number;
    ruralAccess?: number;
    urbanAccess?: number;
  };
  powerPlants?: string[][];
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

export const electricityPages: ElectricityPage[] = ${JSON.stringify(successful.map(p => ({
    id: p.id,
    name: p.name,
    url: p.url,
    title: p.title,
    statistics: p.statistics,
    powerPlants: p.powerPlants,
    content: p.content ? { text: p.content.text?.substring(0, 1000) } : undefined, // Truncate for size
    images: p.images,
    assets: p.assets,
  })), null, 2)};
`;
}

main().catch((e) => {
  console.error(`[electricity-scraper] Fatal: ${e?.stack || e}`);
  process.exit(1);
});
