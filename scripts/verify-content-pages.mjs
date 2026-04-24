/**
 * Verify if all scraped content pages are created as routes
 * 
 * Usage:
 *   node scripts/verify-content-pages.mjs
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const APP_DIR = "src/app";

// Expected pages from scraped content
const EXPECTED_ELECTRICITY_PAGES = [
  { id: "home", route: "/electricity", name: "Home" },
  { id: "generation", route: "/electricity/generation", name: "Generation" },
  { id: "transmission", route: "/electricity/transmission", name: "Transmission" },
  { id: "distribution", route: "/electricity/distribution", name: "Distribution" },
  { id: "distribution-northern", route: "/electricity/distribution/northern", name: "Distribution - Northern Zone" },
  { id: "distribution-southern", route: "/electricity/distribution/southern", name: "Distribution - Southern Zone" },
  { id: "access", route: "/electricity/access", name: "Access" },
  { id: "consumption", route: "/electricity/consumption", name: "Consumption" },
  { id: "reported-challenges", route: "/electricity/reported-challenges", name: "Reported Challenges" },
  { id: "report-challenge", route: "/electricity/report-challenge", name: "Report a Challenge" },
];

async function checkRouteExists(route) {
  const routePath = route.replace(/^\//, "").replace(/\/$/, "");
  const pagePath = path.join(process.cwd(), APP_DIR, routePath, "page.tsx");
  return existsSync(pagePath);
}

async function getContractRoutes() {
  const contractsDir = path.join(process.cwd(), APP_DIR, "contracts");
  const routes = ["/contracts"]; // Main page
  
  try {
    const entries = await readdir(contractsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name === "[id]") {
        routes.push("/contracts/[id]");
        break;
      }
    }
  } catch (e) {
    // Directory doesn't exist
  }
  
  return routes;
}

async function getContractCount() {
  try {
    const contractsPath = path.join(process.cwd(), "src/lib/data/contracts.ts");
    const content = await readFile(contractsPath, "utf8");
    const match = content.match(/export const contractAreas.*?=.*?\[(.*?)\];/s);
    if (match) {
      const contracts = match[1];
      // Count contract objects (rough estimate)
      const count = (contracts.match(/\{\s*id:/g) || []).length;
      return count;
    }
  } catch (e) {
    // File doesn't exist
  }
  return 0;
}

async function main() {
  console.log("🔍 CONTENT PAGES VERIFICATION\n");
  console.log("=".repeat(70));
  
  // Check Electricity Monitor Pages
  console.log("\n📋 ELECTRICITY MONITOR PAGES:\n");
  const electricityStatus = [];
  for (const page of EXPECTED_ELECTRICITY_PAGES) {
    const exists = await checkRouteExists(page.route);
    const icon = exists ? "✅" : "❌";
    electricityStatus.push({ ...page, exists });
    console.log(`   ${icon} ${page.name.padEnd(35)} ${page.route}`);
  }
  
  const electricityCreated = electricityStatus.filter(p => p.exists).length;
  const electricityTotal = EXPECTED_ELECTRICITY_PAGES.length;
  
  // Check Contract Monitor Pages
  console.log("\n📋 CONTRACT MONITOR PAGES:\n");
  const contractRoutes = await getContractRoutes();
  const contractCount = await getContractCount();
  
  console.log(`   ${contractRoutes.includes("/contracts") ? "✅" : "❌"} Main Contracts Page              /contracts`);
  console.log(`   ${contractRoutes.includes("/contracts/[id]") ? "✅" : "❌"} Contract Detail Pages         /contracts/[id]`);
  console.log(`   📊 Total Contracts: ${contractCount}`);
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 SUMMARY:\n");
  console.log(`   Electricity Monitor:`);
  console.log(`   - Pages Created: ${electricityCreated}/${electricityTotal}`);
  console.log(`   - Missing: ${electricityTotal - electricityCreated} pages`);
  console.log(`\n   Contract Monitor:`);
  console.log(`   - Main Page: ${contractRoutes.includes("/contracts") ? "✅" : "❌"}`);
  console.log(`   - Detail Pages: ${contractRoutes.includes("/contracts/[id]") ? "✅" : "❌"} (Dynamic route for ${contractCount} contracts)`);
  
  // Missing pages
  const missingElectricity = electricityStatus.filter(p => !p.exists);
  if (missingElectricity.length > 0) {
    console.log("\n⚠️  MISSING ELECTRICITY MONITOR PAGES:\n");
    missingElectricity.forEach(page => {
      console.log(`   - ${page.name}: ${page.route}`);
    });
  }
  
  // Final verdict
  console.log("\n" + "=".repeat(70));
  if (electricityCreated === electricityTotal && contractRoutes.includes("/contracts") && contractRoutes.includes("/contracts/[id]")) {
    console.log("\n✅ ALL CONTENT PAGES CREATED!");
  } else {
    console.log("\n⚠️  SOME PAGES ARE MISSING - See above for details.");
  }
  console.log();
}

main().catch((e) => {
  console.error(`Fatal error: ${e?.stack || e}`);
  process.exit(1);
});
