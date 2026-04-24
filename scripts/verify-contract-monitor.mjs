/**
 * Verify that all content from ghanacontractmonitor.com has been scraped
 * and compare with local implementation.
 * 
 * Usage:
 *   node scripts/verify-contract-monitor.mjs
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

// Contract URLs from ghanacontractmonitor.com
const CONTRACT_URLS = [
  "https://ghanacontractmonitor.com/expanded-shallow-water-tano-block-1508sqkm/",
  "https://ghanacontractmonitor.com/central-tano-block/",
  "https://ghanacontractmonitor.com/deepwater-tano-ctp-block-3000sqkm/",
  "https://ghanacontractmonitor.com/south-deepwater-tano-3482sqkm/",
  "https://ghanacontractmonitor.com/south-west-tano-block/",
  "https://ghanacontractmonitor.com/shallow-water-cape-three-points-block-1500sqkm/",
  "https://ghanacontractmonitor.com/east-cape-three-point-1565sqkm/",
  "https://ghanacontractmonitor.com/deepwater-cape-three-points/",
  "https://ghanacontractmonitor.com/south-west-saltpond-block/",
  "https://ghanacontractmonitor.com/cape-three-points-block-4-1127sqkm/",
  "https://ghanacontractmonitor.com/onshore-offshore-keta-delta-block-3000sqkm/",
  "https://ghanacontractmonitor.com/offshore-cape-three-points-south-block/",
  "https://ghanacontractmonitor.com/south-west-cape-three-points-block/",
  "https://ghanacontractmonitor.com/west-cape-three-points-block-2-673sqkm/",
  "https://ghanacontractmonitor.com/east-keta-block-2239sqkm",
];

// Contract names from the website
const CONTRACT_NAMES_FROM_SITE = [
  "Expanded Shallow Water Tano Block",
  "Central Tano Block",
  "Deepwater Tano-CTP Block",
  "South Deepwater Tano",
  "Offshore South-West Tano Block",
  "Shallow Water Cape Three Points Block",
  "East Cape Three Point",
  "Deepwater Cape Three Points",
  "South West Saltpond Block",
  "Cape Three Points Block 4",
  "Onshore/Offshore Keta Delta Block",
  "Offshore Cape Three Points South Block",
  "Deepwater Cape Three Points West Offshore",
  "West Cape Three Points Block 2",
  "East Keta Block",
];

async function loadLocalContracts() {
  try {
    const contractsPath = path.join(process.cwd(), "src/lib/data/contracts.ts");
    const content = await readFile(contractsPath, "utf8");
    
    // Extract contract names from the file
    const contractMatches = content.matchAll(/name:\s*"([^"]+)"/g);
    const localContracts = Array.from(contractMatches, m => m[1]);
    
    return localContracts;
  } catch (error) {
    console.error("Error loading local contracts:", error);
    return [];
  }
}

async function main() {
  console.log("🔍 Verifying Contract Monitor Content\n");
  console.log("=" .repeat(60));
  
  // Load local contracts
  const localContracts = await loadLocalContracts();
  
  console.log(`\n📊 Summary:`);
  console.log(`   Website contracts: ${CONTRACT_NAMES_FROM_SITE.length}`);
  console.log(`   Local contracts: ${localContracts.length}`);
  
  // Compare contracts
  console.log(`\n📋 Contract Comparison:\n`);
  
  const missing = [];
  const extra = [];
  const matches = [];
  
  for (const siteContract of CONTRACT_NAMES_FROM_SITE) {
    const found = localContracts.some(local => 
      local.toLowerCase().includes(siteContract.toLowerCase()) ||
      siteContract.toLowerCase().includes(local.toLowerCase())
    );
    
    if (found) {
      matches.push(siteContract);
    } else {
      missing.push(siteContract);
    }
  }
  
  for (const localContract of localContracts) {
    const found = CONTRACT_NAMES_FROM_SITE.some(site => 
      localContract.toLowerCase().includes(site.toLowerCase()) ||
      site.toLowerCase().includes(localContract.toLowerCase())
    );
    
    if (!found) {
      extra.push(localContract);
    }
  }
  
  // Report results
  console.log(`✅ Matched contracts: ${matches.length}`);
  matches.forEach((name, idx) => {
    console.log(`   ${idx + 1}. ${name}`);
  });
  
  if (missing.length > 0) {
    console.log(`\n❌ Missing from local: ${missing.length}`);
    missing.forEach((name, idx) => {
      console.log(`   ${idx + 1}. ${name}`);
    });
  }
  
  if (extra.length > 0) {
    console.log(`\n➕ Extra in local (not on website): ${extra.length}`);
    extra.forEach((name, idx) => {
      console.log(`   ${idx + 1}. ${name}`);
    });
  }
  
  // Check for scraped content
  console.log(`\n📁 Checking for scraped content...`);
  const contentDir = path.join(process.cwd(), "content");
  
  try {
    const dirs = await readFile(contentDir, { withFileTypes: true }).catch(() => null);
    if (dirs) {
      const hasContractMonitor = dirs.some(d => d.name.includes("contract") || d.name.includes("ghanacontractmonitor"));
      if (hasContractMonitor) {
        console.log(`   ✅ Found contract monitor content directory`);
      } else {
        console.log(`   ⚠️  No contract monitor content directory found`);
        console.log(`   📝 Note: Individual contract detail pages may not be scraped yet`);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Could not check content directory`);
  }
  
  // Final verdict
  console.log(`\n${"=".repeat(60)}`);
  if (missing.length === 0 && extra.length === 0) {
    console.log(`\n✅ SUCCESS: All contracts from website are present locally!`);
    console.log(`\n⚠️  NOTE: Individual contract detail pages may need to be scraped separately.`);
    console.log(`   The current implementation uses manually created data.`);
    console.log(`   To scrape detail pages, you would need to:`);
    console.log(`   1. Create a scraper for ghanacontractmonitor.com`);
    console.log(`   2. Extract contract details from each page`);
    console.log(`   3. Store them in a database or content files`);
  } else {
    console.log(`\n⚠️  WARNING: Some contracts are missing or extra!`);
    console.log(`   Please review the differences above.`);
  }
  
  console.log(`\n📝 Recommendations:`);
  console.log(`   1. Verify contract detail pages are accessible at /contracts/[id]`);
  console.log(`   2. Check if individual contract pages from ghanacontractmonitor.com need scraping`);
  console.log(`   3. Compare contract data (operators, status, etc.) with source website`);
  console.log(`   4. Test the local site at http://localhost:3100/contracts\n`);
}

main().catch((e) => {
  console.error(`Fatal error: ${e?.stack || e}`);
  process.exit(1);
});
