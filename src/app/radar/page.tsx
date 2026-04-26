import { LibraryListing } from "@/components/shared/library-listing";
import { resolveRadarListing } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

export default async function RadarPage() {
  const { items } = await resolveRadarListing();

  return (
    <LibraryListing
      items={items}
      title="ACEP Radar"
      description="ACEP Radar provides timely insights, analysis, and monitoring of energy governance, extractive sector transparency, and policy developments across Africa. Sample rows are shown when the snapshot is empty; publish real entries via the CMS or restore snapshots."
      showFilters={true}
      showSearch={true}
    />
  );
}
