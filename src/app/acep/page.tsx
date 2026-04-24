import { notFound } from "next/navigation";
import {
  getAcepSnapshotByUrl,
} from "@/lib/acep-snapshots";

export const dynamic = "force-dynamic";

export default async function AcepRootSnapshotPage() {
  // Render the original ACEP homepage snapshot at /acep for reference
  const entry = await getAcepSnapshotByUrl("https://acep.africa/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  return (
    <div className="bg-white">
      <iframe
        title="ACEP"
        src="/acep-embed"
        className="iframe-container"
      />
    </div>
  );
}

