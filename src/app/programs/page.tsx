import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";

export const dynamic = "force-dynamic";

const programs = [
  { title: "Events", href: "/events" },
  { title: "NextGen Resource Governance Leaders Program", href: "/nextgen10" },
  { title: "The Africa Climate Academy", href: "/climate-academy" },
  { title: "AFREIKH Summer School", href: "/2025-afreikh-summer-school" },
  { title: "Resource Governance Campus Hub", href: "/rgchub" },
] as const;

export default async function ProgramsHubPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/programs/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, intro } = extractPageIntro(html);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            {title || "Programs"}
          </h1>
          {intro && <p className="mt-3 text-base text-slate-600">{intro}</p>}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-xl border border-slate-200 p-5 hover:border-acep-primary/30 hover:shadow-sm transition"
            >
              <div className="text-lg font-semibold text-slate-900 group-hover:text-acep-primary transition-colors">
                {p.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

