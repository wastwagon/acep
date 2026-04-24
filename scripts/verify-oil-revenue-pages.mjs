/**
 * Verify if all scraped oil revenue pages are created as routes
 * 
 * Usage:
 *   node scripts/verify-oil-revenue-pages.mjs
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const APP_DIR = "src/app";

// Expected pages from scraped content
const EXPECTED_OIL_REVENUE_PAGES = [
  { id: "home", route: "/oil-revenue", name: "Home" },
  { id: "collection", route: "/oil-revenue/collection", name: "Collection" },
  { id: "allocation", route: "/oil-revenue/allocation", name: "Allocation" },
  { id: "management", route: "/oil-revenue/management", name: "Management" },
  { id: "projects", route: "/oil-revenue/projects", name: "Projects" },
  { id: "resource-centre", route: "/oil-revenue/resource-centre", name: "Resource Centre" },
  { id: "contact", route: "/oil-revenue/contact", name: "Contact Us" },
];

async function checkRouteExists(route) {
  const routePath = route.replace(/^\//, "").replace(/\/$/, "");
  const pagePath = path.join(process.cwd(), APP_DIR, routePath, "page.tsx");
  return existsSync(pagePath);
}

async function main() {
  console.log("🔍 OIL REVENUE PAGES VERIFICATION\n");
  console.log("=".repeat(70));
  
  // Check Oil Revenue Pages
  console.log("\n📋 OIL REVENUE PAGES:\n");
  const pageStatus = [];
  for (const page of EXPECTED_OIL_REVENUE_PAGES) {
    const exists = await checkRouteExists(page.route);
    const icon = exists ? "✅" : "❌";
    pageStatus.push({ ...page, exists });
    console.log(`   ${icon} ${page.name.padEnd(35)} ${page.route}`);
  }
  
  const pagesCreated = pageStatus.filter(p => p.exists).length;
  const pagesTotal = EXPECTED_OIL_REVENUE_PAGES.length;
  
  // Check sidebar
  const sidebarPath = path.join(process.cwd(), APP_DIR, "oil-revenue", "layout.tsx");
  const sidebarExists = existsSync(sidebarPath);
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 SUMMARY:\n");
  console.log(`   Oil Revenue Pages:`);
  console.log(`   - Pages Created: ${pagesCreated}/${pagesTotal}`);
  console.log(`   - Missing: ${pagesTotal - pagesCreated} pages`);
  console.log(`   - Sidebar Layout: ${sidebarExists ? "✅" : "❌"}`);
  
  // Missing pages
  const missingPages = pageStatus.filter(p => !p.exists);
  if (missingPages.length > 0) {
    console.log("\n⚠️  MISSING PAGES:\n");
    missingPages.forEach(page => {
      console.log(`   - ${page.name}: ${page.route}`);
    });
  }
  
  // Final verdict
  console.log("\n" + "=".repeat(70));
  if (pagesCreated === pagesTotal && sidebarExists) {
    console.log("\n✅ ALL OIL REVENUE PAGES CREATED!");
  } else {
    console.log("\n⚠️  SOME PAGES ARE MISSING - See above for details.");
  }
  console.log();
}

main().catch((e) => {
  console.error(`Fatal error: ${e?.stack || e}`);
  process.exit(1);
});
