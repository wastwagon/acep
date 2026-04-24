/**
 * Scrape detailed contract information from ghanacontractmonitor.com
 * 
 * Extracts:
 * - Contract parties
 * - Effective dates
 * - Exploration periods
 * - Minimum exploration programs
 * - Minimum expenditure
 * - Yearly updates (2019-2023)
 * - Surface rental payments
 * - Other contract details
 * 
 * Usage:
 *   node scripts/scrape-contract-monitor.mjs --out content/contract-monitor
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const DEFAULT_OUT_DIR = "content/contract-monitor";
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_TIMEOUT_MS = 30_000;

// Contract URLs from ghanacontractmonitor.com
const CONTRACT_URLS = [
  { id: 1, url: "https://ghanacontractmonitor.com/expanded-shallow-water-tano-block-1508sqkm/", name: "Expanded Shallow Water Tano Block" },
  { id: 2, url: "https://ghanacontractmonitor.com/central-tano-block/", name: "Central Tano Block" },
  { id: 3, url: "https://ghanacontractmonitor.com/deepwater-tano-ctp-block-3000sqkm/", name: "Deepwater Tano-CTP Block" },
  { id: 4, url: "https://ghanacontractmonitor.com/south-deepwater-tano-3482sqkm/", name: "South Deepwater Tano" },
  { id: 5, url: "https://ghanacontractmonitor.com/south-west-tano-block/", name: "Offshore South-West Tano Block" },
  { id: 6, url: "https://ghanacontractmonitor.com/shallow-water-cape-three-points-block-1500sqkm/", name: "Shallow Water Cape Three Points Block" },
  { id: 7, url: "https://ghanacontractmonitor.com/east-cape-three-point-1565sqkm/", name: "East Cape Three Point" },
  { id: 8, url: "https://ghanacontractmonitor.com/deepwater-cape-three-points/", name: "Deepwater Cape Three Points" },
  { id: 9, url: "https://ghanacontractmonitor.com/south-west-saltpond-block/", name: "South West Saltpond Block" },
  { id: 10, url: "https://ghanacontractmonitor.com/cape-three-points-block-4-1127sqkm/", name: "Cape Three Points Block 4" },
  { id: 11, url: "https://ghanacontractmonitor.com/onshore-offshore-keta-delta-block-3000sqkm/", name: "Onshore/Offshore Keta Delta Block" },
  { id: 12, url: "https://ghanacontractmonitor.com/offshore-cape-three-points-south-block/", name: "Offshore Cape Three Points South Block" },
  { id: 13, url: "https://ghanacontractmonitor.com/south-west-cape-three-points-block/", name: "Deepwater Cape Three Points West Offshore" },
  { id: 14, url: "https://ghanacontractmonitor.com/west-cape-three-points-block-2-673sqkm/", name: "West Cape Three Points Block 2" },
  { id: 15, url: "https://ghanacontractmonitor.com/east-keta-block-2239sqkm", name: "East Keta Block" },
];

function parseArgs(argv) {
  const args = {
    out: DEFAULT_OUT_DIR,
    concurrency: DEFAULT_CONCURRENCY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    userAgent: "ACEP-Contract-Scraper/1.0 (+https://acep.africa) - internal migration",
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--out" && next) args.out = next, i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--help") {
      console.log(`\nContract Monitor Scraper\n\nOptions:\n  --out <dir>\n  --concurrency <n>\n  --timeoutMs <ms>\n  --userAgent <ua>\n`);
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

function extractContractDetails(html, contractName) {
  const $ = cheerio.load(html);
  const details = {
    name: contractName,
    parties: null,
    effectiveDate: null,
    initialExplorationPeriod: null,
    minimumExplorationProgram: [],
    minimumExpenditure: null,
    updates: {},
    surfaceRental: null,
    rawHtml: html,
  };

  // Extract contract parties - look for <strong>Contract Parties</strong> followed by <p>
  $("strong:contains('Contract Parties')").each((_, el) => {
    const nextP = $(el).parent().next("p");
    if (nextP.length) {
      const partiesText = nextP.text().trim();
      if (partiesText) {
        details.parties = partiesText.split(/[,;]/).map(p => p.trim()).filter(Boolean);
      }
    }
    // Also check if it's in the same paragraph
    const parentText = $(el).parent().text();
    if (parentText.includes("Contract Parties") && !details.parties) {
      const match = parentText.match(/Contract Parties[^:]*[:]?\s*(.+?)(?:\n|$)/i);
      if (match) {
        details.parties = match[1].split(/[,;]/).map(p => p.trim()).filter(Boolean);
      }
    }
  });

  // Extract effective date - look for "Effective Date:"
  $("p").each((_, el) => {
    const text = $(el).text();
    const effectiveDateMatch = text.match(/Effective\s+Date:\s*([^\n]+)/i);
    if (effectiveDateMatch && !details.effectiveDate) {
      details.effectiveDate = effectiveDateMatch[1].trim();
    }
  });

  // Extract initial exploration period
  $("p").each((_, el) => {
    const text = $(el).text();
    const periodMatch = text.match(/Initial\s+Exploration\s+Period[^:]*:\s*([^\n]+)/i);
    if (periodMatch && !details.initialExplorationPeriod) {
      details.initialExplorationPeriod = periodMatch[1].trim();
    }
  });

  // Extract minimum exploration program - look for heading followed by list items
  $("strong:contains('Minimum Exploration Program'), h3:contains('Minimum Exploration Program')").each((_, el) => {
    $(el).parent().nextUntil("strong, h3, h4").find("li").each((_, li) => {
      const text = $(li).text().trim();
      if (text) details.minimumExplorationProgram.push(text);
    });
    // Also check next siblings
    $(el).nextAll().each((_, sibling) => {
      if ($(sibling).is("ul, ol")) {
        $(sibling).find("li").each((_, li) => {
          const text = $(li).text().trim();
          if (text) details.minimumExplorationProgram.push(text);
        });
      }
    });
  });

  // Extract minimum expenditure - look for "Minimum Expenditure" followed by $ amount
  $("strong:contains('Minimum Expenditure'), p:contains('Minimum Expenditure')").each((_, el) => {
    const text = $(el).text();
    const expenditureMatch = text.match(/Minimum\s+Expenditure[^$]*\$([0-9,]+\.?\d*)/i);
    if (expenditureMatch && !details.minimumExpenditure) {
      details.minimumExpenditure = expenditureMatch[1].trim();
    }
    // Also check next sibling
    const nextText = $(el).next().text();
    if (nextText && !details.minimumExpenditure) {
      const nextMatch = nextText.match(/\$([0-9,]+\.?\d*)/);
      if (nextMatch) {
        details.minimumExpenditure = nextMatch[1].trim();
      }
    }
  });
  // Also check standalone $ amounts near "Minimum Expenditure"
  $("p").each((_, el) => {
    const text = $(el).text();
    if (text.includes("Minimum Expenditure") && !details.minimumExpenditure) {
      const match = text.match(/Minimum\s+Expenditure[^$]*\$([0-9,]+\.?\d*)/i);
      if (match) {
        details.minimumExpenditure = match[1].trim();
      }
    }
  });

  // Extract yearly updates - look for tab panels (vc_tta-panel) with year updates
  const updateYears = ["2023", "2022", "2021", "2020", "2019"];
  updateYears.forEach(year => {
    // Look for tab panels with the year update
    $(`.vc_tta-panel:has(.vc_tta-title-text:contains('${year} Update'))`).each((_, panel) => {
      let updateText = "";
      // Get content from panel body
      $(panel).find(".vc_tta-panel-body").each((_, body) => {
        $(body).find("p").each((_, p) => {
          const text = $(p).text().trim();
          if (text && !text.match(/^\d{4}\s+Update$/i)) {
            updateText += text + "\n";
          }
        });
        // Also get direct text content
        const directText = $(body).text().trim();
        if (directText && !directText.match(/^\d{4}\s+Update$/i)) {
          updateText += directText + "\n";
        }
      });
      if (updateText.trim()) {
        details.updates[year] = updateText.trim();
      }
    });
    
    // Fallback: look for h4 with year + "Update" followed by content
    if (!details.updates[year]) {
      $(`h4:contains('${year} Update'), .vc_tta-title-text:contains('${year} Update')`).each((_, el) => {
        let updateText = "";
        // Find the panel body associated with this title
        const panel = $(el).closest(".vc_tta-panel");
        if (panel.length) {
          panel.find(".vc_tta-panel-body p").each((_, p) => {
            const text = $(p).text().trim();
            if (text) updateText += text + "\n";
          });
        } else {
          // Fallback: get next siblings
          $(el).nextUntil("h4, h3, strong:contains('Contract')").each((_, sibling) => {
            const text = $(sibling).text().trim();
            if (text && !text.match(/^\d{4}\s+Update$/i)) {
              updateText += text + "\n";
            }
          });
        }
        if (updateText.trim()) {
          details.updates[year] = updateText.trim();
        }
      });
    }
  });

  // Extract surface rental - look for patterns
  $("p, div").each((_, el) => {
    const text = $(el).text();
    if (text.includes("surface rental") || text.includes("Surface Rental")) {
      const match = text.match(/surface\s+rental[^$]*\$([0-9,]+\.?\d*)/i);
      if (match && !details.surfaceRental) {
        details.surfaceRental = match[1].trim();
      }
      // Also try simpler pattern
      if (!details.surfaceRental) {
        const simpleMatch = text.match(/\$\s*([0-9,]+\.?\d*)\s*(?:outstanding|balance|payment|rental)/i);
        if (simpleMatch) {
          details.surfaceRental = simpleMatch[1].trim();
        }
      }
    }
  });

  return details;
}

async function main() {
  const args = parseArgs(process.argv);
  const outRoot = path.resolve(process.cwd(), args.out);
  await mkdir(outRoot, { recursive: true });

  console.log(`[contract-scraper] Starting scrape of ${CONTRACT_URLS.length} contracts...`);
  console.log(`[contract-scraper] Output directory: ${outRoot}`);

  const contracts = [];
  let i = 0;

  async function worker() {
    while (true) {
      const n = i++;
      if (n >= CONTRACT_URLS.length) return;
      
      const contract = CONTRACT_URLS[n];
      console.log(`[contract-scraper] [${n + 1}/${CONTRACT_URLS.length}] Fetching: ${contract.name}`);

      try {
        const { res, buf } = await fetchWithTimeout(contract.url, {
          timeoutMs: args.timeoutMs,
          userAgent: args.userAgent,
        });

        if (res.status !== 200) {
          console.error(`[contract-scraper] ERROR ${contract.url}: HTTP ${res.status}`);
          contracts.push({
            id: contract.id,
            name: contract.name,
            url: contract.url,
            status: res.status,
            error: `HTTP ${res.status}`,
          });
          continue;
        }

        const html = buf.toString("utf8");
        const details = extractContractDetails(html, contract.name);

        // Save raw HTML (sanitize filename)
        const safeName = contract.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const htmlPath = path.join(outRoot, `contract-${contract.id}-${safeName}.html`);
        await mkdir(path.dirname(htmlPath), { recursive: true });
        await writeFile(htmlPath, html);

        contracts.push({
          id: contract.id,
          name: contract.name,
          url: contract.url,
          status: 200,
          ...details,
          savedAs: path.relative(outRoot, htmlPath),
        });

        console.log(`[contract-scraper] ✓ Extracted: ${contract.name}`);
        if (details.parties) console.log(`   Parties: ${details.parties.length}`);
        if (details.effectiveDate) console.log(`   Effective Date: ${details.effectiveDate}`);
        if (Object.keys(details.updates).length > 0) {
          console.log(`   Updates: ${Object.keys(details.updates).join(", ")}`);
        }

      } catch (err) {
        console.error(`[contract-scraper] ERROR ${contract.url}: ${String(err?.message || err)}`);
        contracts.push({
          id: contract.id,
          name: contract.name,
          url: contract.url,
          status: "error",
          error: String(err?.message || err),
        });
      }
    }
  }

  // Run workers
  await Promise.all(Array.from({ length: args.concurrency }, () => worker()));

  // Sort by ID
  contracts.sort((a, b) => (a.id || 0) - (b.id || 0));

  // Save index
  const index = {
    source: {
      baseUrl: "https://ghanacontractmonitor.com",
      scrapedAt: new Date().toISOString(),
      userAgent: args.userAgent,
    },
    totals: {
      contracts: contracts.length,
      successful: contracts.filter(c => c.status === 200).length,
      errors: contracts.filter(c => c.status !== 200).length,
    },
    contracts,
  };

  const indexPath = path.join(outRoot, "index.json");
  await writeFile(indexPath, JSON.stringify(index, null, 2));

  console.log(`\n[contract-scraper] Done!`);
  console.log(`[contract-scraper] Saved index: ${indexPath}`);
  console.log(`[contract-scraper] Success: ${index.totals.successful}/${index.totals.contracts}`);
  console.log(`[contract-scraper] Errors: ${index.totals.errors}/${index.totals.contracts}`);

  // Generate TypeScript data file
  const tsPath = path.join(outRoot, "contracts-data.ts");
  const tsContent = generateTypeScriptData(contracts);
  await writeFile(tsPath, tsContent);
  console.log(`[contract-scraper] Generated TypeScript data: ${tsPath}`);
}

function generateTypeScriptData(contracts) {
  const successful = contracts.filter(c => c.status === 200);
  
  return `// Auto-generated contract data from ghanacontractmonitor.com
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - Run: node scripts/scrape-contract-monitor.mjs

export interface ContractDetail {
  id: number;
  name: string;
  url: string;
  parties?: string[] | null;
  effectiveDate?: string | null;
  initialExplorationPeriod?: string | null;
  minimumExplorationProgram?: string[];
  minimumExpenditure?: string | null;
  updates?: Record<string, string>;
  surfaceRental?: string | null;
}

export const contractDetails: ContractDetail[] = ${JSON.stringify(successful.map(c => ({
    id: c.id,
    name: c.name,
    url: c.url,
    parties: c.parties,
    effectiveDate: c.effectiveDate,
    initialExplorationPeriod: c.initialExplorationPeriod,
    minimumExplorationProgram: c.minimumExplorationProgram,
    minimumExpenditure: c.minimumExpenditure,
    updates: c.updates,
    surfaceRental: c.surfaceRental,
  })), null, 2)};
`;
}

main().catch((e) => {
  console.error(`[contract-scraper] Fatal: ${e?.stack || e}`);
  process.exit(1);
});
