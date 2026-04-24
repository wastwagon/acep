/**
 * Comprehensive verification of contract scraping
 * Checks data completeness, quality, and compares with source
 * 
 * Usage:
 *   node scripts/verify-contract-scraping.mjs
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

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

async function loadScrapedData() {
  try {
    const dataPath = path.join(process.cwd(), "content/contract-monitor/contracts-data.ts");
    const content = await readFile(dataPath, "utf8");
    
    // Extract the contractDetails array
    const match = content.match(/export const contractDetails: ContractDetail\[\] = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error("Could not find contractDetails array");
    }
    
    const contracts = eval(match[1]); // Safe here as it's our own generated file
    return contracts;
  } catch (error) {
    console.error("Error loading scraped data:", error);
    return [];
  }
}

async function loadIndex() {
  try {
    const indexPath = path.join(process.cwd(), "content/contract-monitor/index.json");
    const content = await readFile(indexPath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error loading index:", error);
    return null;
  }
}

async function main() {
  console.log("🔍 COMPREHENSIVE CONTRACT SCRAPING VERIFICATION\n");
  console.log("=".repeat(70));
  
  const index = await loadIndex();
  const contracts = await loadScrapedData();
  
  // Basic counts
  console.log(`\n📊 BASIC STATISTICS:`);
  console.log(`   Total contracts expected: ${CONTRACT_URLS.length}`);
  console.log(`   Contracts scraped: ${contracts.length}`);
  console.log(`   HTML files saved: ${index?.totals?.successful || 0}`);
  console.log(`   Errors: ${index?.totals?.errors || 0}`);
  
  // Data completeness check
  console.log(`\n📋 DATA COMPLETENESS CHECK:\n`);
  
  const fields = {
    parties: "Contract Parties",
    effectiveDate: "Effective Date",
    initialExplorationPeriod: "Initial Exploration Period",
    minimumExplorationProgram: "Minimum Exploration Program",
    minimumExpenditure: "Minimum Expenditure",
    updates: "Yearly Updates",
    surfaceRental: "Surface Rental",
  };
  
  const stats = {};
  for (const [key, label] of Object.entries(fields)) {
    const count = contracts.filter(c => {
      if (key === "updates") {
        return c.updates && Object.keys(c.updates).length > 0;
      }
      if (key === "minimumExplorationProgram") {
        return c.minimumExplorationProgram && c.minimumExplorationProgram.length > 0;
      }
      return c[key] !== null && c[key] !== undefined;
    }).length;
    stats[key] = { count, label, percentage: ((count / contracts.length) * 100).toFixed(1) };
  }
  
  for (const [key, stat] of Object.entries(stats)) {
    const icon = stat.count === contracts.length ? "✅" : stat.count > 0 ? "⚠️" : "❌";
    console.log(`   ${icon} ${stat.label.padEnd(35)} ${stat.count}/${contracts.length} (${stat.percentage}%)`);
  }
  
  // Updates detail
  console.log(`\n📅 YEARLY UPDATES BREAKDOWN:\n`);
  const updateYears = ["2023", "2022", "2021", "2020", "2019"];
  for (const year of updateYears) {
    const count = contracts.filter(c => c.updates && c.updates[year]).length;
    const icon = count === contracts.length ? "✅" : count > 0 ? "⚠️" : "❌";
    console.log(`   ${icon} ${year} Update: ${count}/${contracts.length} contracts`);
  }
  
  // Sample data quality check
  console.log(`\n🔍 DATA QUALITY SAMPLES:\n`);
  
  const sampleContract = contracts.find(c => c.id === 1);
  if (sampleContract) {
    console.log(`   Contract #1: ${sampleContract.name}`);
    console.log(`   - Parties: ${sampleContract.parties ? sampleContract.parties.length : 0} parties`);
    console.log(`   - Effective Date: ${sampleContract.effectiveDate || "Missing"}`);
    console.log(`   - Exploration Period: ${sampleContract.initialExplorationPeriod ? "Present" : "Missing"}`);
    console.log(`   - Min Program Items: ${sampleContract.minimumExplorationProgram?.length || 0}`);
    console.log(`   - Min Expenditure: ${sampleContract.minimumExpenditure || "Missing"}`);
    console.log(`   - Updates: ${sampleContract.updates ? Object.keys(sampleContract.updates).length : 0} years`);
    console.log(`   - Surface Rental: ${sampleContract.surfaceRental || "Missing"}`);
    
    if (sampleContract.updates && Object.keys(sampleContract.updates).length > 0) {
      console.log(`   - Sample Update (2023): ${sampleContract.updates["2023"]?.substring(0, 100) || "N/A"}...`);
    }
  }
  
  // Issues report
  console.log(`\n⚠️  POTENTIAL ISSUES:\n`);
  
  const issues = [];
  
  contracts.forEach(contract => {
    if (!contract.parties || contract.parties.length === 0) {
      issues.push(`Contract #${contract.id} (${contract.name}): Missing parties`);
    }
    if (!contract.effectiveDate) {
      issues.push(`Contract #${contract.id} (${contract.name}): Missing effective date`);
    }
    if (!contract.updates || Object.keys(contract.updates).length === 0) {
      issues.push(`Contract #${contract.id} (${contract.name}): Missing updates`);
    }
  });
  
  if (issues.length === 0) {
    console.log(`   ✅ No major issues found!`);
  } else {
    issues.slice(0, 10).forEach(issue => {
      console.log(`   - ${issue}`);
    });
    if (issues.length > 10) {
      console.log(`   ... and ${issues.length - 10} more issues`);
    }
  }
  
  // Final verdict
  console.log(`\n${"=".repeat(70)}`);
  const allComplete = contracts.length === CONTRACT_URLS.length && 
                       stats.parties.count === contracts.length &&
                       stats.effectiveDate.count === contracts.length &&
                       stats.updates.count === contracts.length;
  
  if (allComplete) {
    console.log(`\n✅ VERIFICATION PASSED: All contracts scraped with complete data!`);
  } else {
    console.log(`\n⚠️  VERIFICATION COMPLETE: Some data may be missing. Review above.`);
  }
  
  console.log(`\n📝 RECOMMENDATIONS:`);
  console.log(`   1. Test contract detail pages at http://localhost:3100/contracts/[id]`);
  console.log(`   2. Verify updates are displaying correctly`);
  console.log(`   3. Check minimum expenditure extraction (some may be missing)`);
  console.log(`   4. Review any contracts with missing data\n`);
}

main().catch((e) => {
  console.error(`Fatal error: ${e?.stack || e}`);
  process.exit(1);
});
