import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml, transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";
import { extractListingItems } from "@/lib/acep-extract";
import { convertAcepListItemsToPosts } from "@/lib/data/post-converters";
import { LibraryListing } from "@/components/shared/library-listing";

export const dynamic = "force-dynamic";

export default async function AnnualReportsPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/annual-reports/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const transformed = transformAcepHtmlForLocalAssets(html, { extractBody: true });
  const extractedItems = extractListingItems(html);

  // Convert to Post format
  const items = convertAcepListItemsToPosts(extractedItems, "Annual Reports");

  // Sort by date (newest first)
  const sortedItems = items.sort((a, b) => {
    if (a.dateText && b.dateText) {
      return new Date(b.dateText).getTime() - new Date(a.dateText).getTime();
    }
    return 0;
  });

  return (
    <LibraryListing
      items={sortedItems}
      title="Annual Reports"
      description="Comprehensive annual reports documenting ACEP's activities, achievements, and impact in promoting transparent and accountable energy governance in Africa."
      showFilters={true}
      showSearch={true}
    />
  );
}
