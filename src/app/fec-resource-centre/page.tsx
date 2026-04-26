import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveFecResourceCentrePage } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveFecResourceCentrePage();
  if (!r) return { title: "ACEP" };
  return { title: r.seoTitle, description: r.seoDescription };
}

export default async function FecResourceCentrePage() {
  const r = await resolveFecResourceCentrePage();
  if (!r) notFound();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{r.title}</h1>
          {r.intro && <p className="mt-3 text-base text-slate-600">{r.intro}</p>}
        </div>

        <div className="mt-8 max-w-4xl">
          {r.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={r.heroImage}
              alt=""
              className="w-full max-w-xl rounded-acepCard border border-slate-200 bg-slate-50"
            />
          )}

          {r.downloads.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {r.downloads.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  target={d.href.startsWith("http") ? "_blank" : undefined}
                  rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center rounded-acepBtn border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-acep-primary/30 hover:bg-slate-50 transition"
                >
                  {d.text || "Read"}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
