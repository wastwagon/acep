import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml, transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";
import { extractListingItems } from "@/lib/acep-extract";
import { convertAcepListItemsToPosts } from "@/lib/data/post-converters";
import { LibraryListing } from "@/components/shared/library-listing";

export const dynamic = "force-dynamic";

export default async function RadarPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/radar/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const transformed = transformAcepHtmlForLocalAssets(html, { extractBody: true });
  const extractedItems = extractListingItems(html);

  // Convert to Post format
  const items = convertAcepListItemsToPosts(extractedItems, "ACEP Radar");

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
      title="ACEP Radar"
      description="ACEP Radar provides timely insights, analysis, and monitoring of energy governance, extractive sector transparency, and policy developments across Africa."
      showFilters={true}
      showSearch={true}
    />
  );
}
