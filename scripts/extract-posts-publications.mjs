/**
 * Extract all posts, publications, and reports from scraped ACEP content
 * Creates structured data files for use in Next.js pages
 */
import { readFile, readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import * as cheerio from "cheerio";

const CONTENT_DIR = "content/acep";
const SNAPSHOTS_DIR = join(CONTENT_DIR, "snapshots", "acep.africa");

async function extractPostData(html, url) {
  const $ = cheerio.load(html);
  
  // Extract title
  const title = $("h1").first().text().trim() || 
                $("title").text().replace(/[-|].*$/, "").trim() ||
                "Untitled";
  
  // Extract featured image
  const featuredImage = $(".featured-image img, .wp-post-image, .entry-content img").first().attr("src") ||
                        $('meta[property="og:image"]').attr("content") ||
                        undefined;
  
  // Extract date
  const dateText = $("time").first().text().trim() ||
                   $(".entry-date, .post-date").first().text().trim() ||
                   $('meta[property="article:published_time"]').attr("content")?.split("T")[0] ||
                   undefined;
  
  // Extract excerpt/description
  const excerpt = $('meta[property="og:description"]').attr("content") ||
                   $(".entry-summary, .post-excerpt").first().text().trim() ||
                   $(".entry-content p").first().text().trim() ||
                   undefined;
  
  // Extract main content
  const content = $(".entry-content, .post-content, .elementor-widget-theme-post-content").html() ||
                   $("article").html() ||
                   $("main").html() ||
                   "";
  
  // Extract PDF links
  const pdfLinks = [];
  $("a[href$='.pdf']").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (href) {
      pdfLinks.push({
        url: href,
        text: text || "Download PDF",
      });
    }
  });
  
  // Extract category
  const category = $(".category, .post-categories a").first().text().trim() ||
                   $('meta[property="article:section"]').attr("content") ||
                   undefined;
  
  // Extract tags
  const tags = [];
  $(".tags a, .post-tags a").each((_, el) => {
    const tag = $(el).text().trim();
    if (tag) tags.push(tag);
  });
  
  return {
    url,
    title,
    featuredImage,
    dateText,
    excerpt,
    content: content.substring(0, 50000), // Limit content size
    pdfLinks,
    category,
    tags,
  };
}

async function processDirectory(dir, baseUrl = "") {
  const items = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subItems = await processDirectory(fullPath, baseUrl);
      items.push(...subItems);
    } else if (entry.name === "index.html") {
      try {
        const html = await readFile(fullPath, "utf-8");
        const relativePath = fullPath.replace(SNAPSHOTS_DIR, "").replace(/\\/g, "/");
        const url = `https://acep.africa${relativePath.replace("/index.html", "/")}`;
        const data = await extractPostData(html, url);
        items.push(data);
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
  
  return items;
}

async function main() {
  console.log("Extracting posts and publications from scraped content...");
  
  const allItems = await processDirectory(SNAPSHOTS_DIR);
  
  // Categorize items
  const newsBlogPosts = allItems.filter(item => 
    item.url.includes("/news") || 
    item.url.includes("/blog") ||
    item.category?.toLowerCase().includes("news") ||
    item.category?.toLowerCase().includes("blog")
  );
  
  const publications = allItems.filter(item =>
    item.url.includes("/research") ||
    item.url.includes("/policy") ||
    item.category?.toLowerCase().includes("research") ||
    item.category?.toLowerCase().includes("policy") ||
    item.category?.toLowerCase().includes("publication")
  );
  
  const pressStatements = allItems.filter(item =>
    item.url.includes("/press") ||
    item.category?.toLowerCase().includes("press") ||
    item.category?.toLowerCase().includes("statement")
  );
  
  const reports = allItems.filter(item =>
    item.url.includes("/report") ||
    item.url.includes("/annual") ||
    item.category?.toLowerCase().includes("report") ||
    item.pdfLinks.length > 0
  );
  
  // Save categorized data
  const outputDir = join(CONTENT_DIR, "extracted");
  await writeFile(
    join(outputDir, "all-posts.json"),
    JSON.stringify(allItems, null, 2)
  );
  
  await writeFile(
    join(outputDir, "news-blog-posts.json"),
    JSON.stringify(newsBlogPosts, null, 2)
  );
  
  await writeFile(
    join(outputDir, "publications.json"),
    JSON.stringify(publications, null, 2)
  );
  
  await writeFile(
    join(outputDir, "press-statements.json"),
    JSON.stringify(pressStatements, null, 2)
  );
  
  await writeFile(
    join(outputDir, "reports.json"),
    JSON.stringify(reports, null, 2)
  );
  
  console.log(`\nExtraction complete!`);
  console.log(`Total items: ${allItems.length}`);
  console.log(`News/Blog Posts: ${newsBlogPosts.length}`);
  console.log(`Publications: ${publications.length}`);
  console.log(`Press Statements: ${pressStatements.length}`);
  console.log(`Reports: ${reports.length}`);
  console.log(`\nData saved to: ${outputDir}/`);
}

main().catch(console.error);
