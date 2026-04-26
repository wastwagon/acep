import { LibraryListing } from "@/components/shared/library-listing";
import { resolveAnnualReportsListing } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

export default async function AnnualReportsPage() {
  const { items } = await resolveAnnualReportsListing();

  return (
    <LibraryListing
      items={items}
      title="Annual Reports"
      description="Comprehensive annual reports documenting ACEP’s activities, achievements, and impact in promoting transparent and accountable energy governance in Africa. Sample rows appear when the snapshot has no list yet—replace with live content in the CMS."
      showFilters={true}
      showSearch={true}
    />
  );
}
