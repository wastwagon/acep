/**
 * Comprehensive verification of oil revenue scraping
 * 
 * Usage:
 *   node scripts/verify-oil-revenue.mjs
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

const EXPECTED_PAGES = [
  "home",
  "collection",
  "allocation",
  "management",
  "projects",
  "resource-centre",
  "contact",
];

async function loadScrapedData() {
  try {
    const indexPath = path.join(process.cwd(), "content/oil-revenue/index.json");
    const content = await readFile(indexPath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error loading scraped data:", error);
    return null;
  }
}

async function main() {
  console.log("🔍 COMPREHENSIVE OIL REVENUE VERIFICATION\n");
  console.log("=".repeat(70));
  
  const index = await loadScrapedData();
  
  if (!index) {
    console.error("❌ Could not load scraped data!");
    process.exit(1);
  }
  
  const pages = index.pages || [];
  
  // Basic counts
  console.log(`\n📊 BASIC STATISTICS:`);
  console.log(`   Total pages expected: ${EXPECTED_PAGES.length}`);
  console.log(`   Pages scraped: ${pages.length}`);
  console.log(`   Successful: ${index.totals?.successful || 0}`);
  console.log(`   Errors: ${index.totals?.errors || 0}`);
  
  // Page-by-page verification
  console.log(`\n📋 PAGE VERIFICATION:\n`);
  
  const pageStatus = {};
  for (const expectedId of EXPECTED_PAGES) {
    const page = pages.find(p => p.id === expectedId);
    if (page && page.status === 200) {
      pageStatus[expectedId] = { found: true, hasContent: !!page.content, hasImages: (page.images?.length || 0) > 0 };
      const icon = page.content ? "✅" : "⚠️";
      console.log(`   ${icon} ${page.name.padEnd(35)} Content: ${page.content ? "Yes" : "No"} | Images: ${page.images?.length || 0}`);
    } else {
      pageStatus[expectedId] = { found: false };
      console.log(`   ❌ ${expectedId.padEnd(35)} NOT FOUND`);
    }
  }
  
  // Data completeness check
  console.log(`\n📋 DATA COMPLETENESS CHECK:\n`);
  
  const homePage = pages.find(p => p.id === "home");
  if (homePage) {
    console.log(`   Home Page Data:`);
    console.log(`   - Statistics: ${homePage.statistics ? Object.keys(homePage.statistics).length : 0} items`);
    console.log(`   - Revenue Data: ${homePage.revenueData ? homePage.revenueData.length : 0} rows`);
    console.log(`   - Images: ${homePage.images?.length || 0}`);
    console.log(`   - Assets: ${homePage.assets?.length || 0}`);
    
    if (homePage.statistics) {
      console.log(`\n   Statistics Extracted:`);
      Object.entries(homePage.statistics).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`);
      });
    }
  }
  
  // Images check
  console.log(`\n🖼️  IMAGES EXTRACTION:\n`);
  let totalImages = 0;
  pages.forEach(page => {
    const imgCount = page.images?.length || 0;
    totalImages += imgCount;
    if (imgCount > 0) {
      console.log(`   ${page.name.padEnd(35)} ${imgCount} images`);
    }
  });
  console.log(`\n   Total Images Found: ${totalImages}`);
  
  // Content quality check
  console.log(`\n📄 CONTENT QUALITY:\n`);
  pages.forEach(page => {
    if (page.content && page.content.text) {
      const wordCount = page.content.text.split(/\s+/).length;
      const hasSubstantialContent = wordCount > 100;
      const icon = hasSubstantialContent ? "✅" : "⚠️";
      console.log(`   ${icon} ${page.name.padEnd(35)} ${wordCount} words`);
    } else {
      console.log(`   ⚠️  ${page.name.padEnd(35)} No text content`);
    }
  });
  
  // Final verdict
  console.log(`\n${"=".repeat(70)}`);
  const allPagesFound = EXPECTED_PAGES.every(id => pageStatus[id]?.found);
  const allHaveContent = pages.filter(p => p.status === 200).every(p => p.content);
  
  if (allPagesFound && allHaveContent && index.totals.errors === 0) {
    console.log(`\n✅ VERIFICATION PASSED: All pages scraped with content!`);
  } else {
    console.log(`\n⚠️  VERIFICATION COMPLETE: Some issues found. Review above.`);
  }
  
  console.log(`\n📝 RECOMMENDATIONS:`);
  console.log(`   1. Test oil revenue pages at http://localhost:3100/oil-revenue`);
  console.log(`   2. Verify images are loading correctly`);
  console.log(`   3. Check revenue data tables match source`);
  console.log(`   4. Verify statistics are accurate`);
  console.log(`   5. Test all sub-pages (collection, allocation, management, etc.)\n`);
}

main().catch((e) => {
  console.error(`Fatal error: ${e?.stack || e}`);
  process.exit(1);
});
