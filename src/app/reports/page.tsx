import { getReports } from "@/lib/data/posts";
import { ReportsListing } from "@/components/shared/reports-listing";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await getReports();

  return <ReportsListing reports={reports} />;
}
