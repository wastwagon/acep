/**
 * Fetch power plants table data from electricitymonitorgh.com AJAX endpoint
 * 
 * Usage:
 *   node scripts/fetch-electricity-table.mjs
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

const TABLE_AJAX_URL = "https://electricitymonitorgh.com/wp-admin/admin-ajax.php?action=get_wdtable&table_id=7";

async function fetchTableData() {
  try {
    console.log(`[table-fetch] Fetching power plants table data...`);
    
    const response = await fetch(TABLE_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "ACEP-Table-Fetcher/1.0",
      },
      body: "draw=1&start=0&length=1000", // Get all rows
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    const outPath = path.join(process.cwd(), "content/electricity-monitor/power-plants-table.json");
    await writeFile(outPath, JSON.stringify(data, null, 2));
    
    console.log(`[table-fetch] ✓ Saved table data: ${outPath}`);
    console.log(`[table-fetch] Records: ${data.data?.length || 0}`);
    
    return data;
  } catch (error) {
    console.error(`[table-fetch] ERROR: ${error.message}`);
    return null;
  }
}

fetchTableData().catch(e => {
  console.error(`Fatal: ${e?.stack || e}`);
  process.exit(1);
});
