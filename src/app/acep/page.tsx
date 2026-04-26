import Link from "next/link";
import { getAcepSnapshotByUrl } from "@/lib/acep-snapshots";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ACEP.org snapshot (reference) | ACEP",
  description: "Read-only embed of a harvested acep.africa page when a snapshot is available, or a static fallback with a link to the public site home.",
};

export default async function AcepRootSnapshotPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/");

  if (entry && entry.status === 200 && entry.savedAs) {
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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-2xl font-semibold text-slate-900">Snapshot not available</h1>
      <p className="mt-3 text-slate-600">
        A harvested HTML copy of the legacy site has not been loaded on this instance. The main public experience is
        the Next.js site at home; you can re-run the snapshot pipeline or edit content in the admin CMS.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants(), "mt-8 inline-flex")}
      >
        Go to homepage
      </Link>
    </div>
  );
}
