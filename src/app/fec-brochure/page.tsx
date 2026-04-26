import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveFecBrochurePage } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

export default async function FecBrochurePage() {
  const r = await resolveFecBrochurePage();
  if (!r) notFound();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{r.title}</h1>
        </div>

        <div className="mt-8 max-w-3xl">
          {r.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={r.heroImage}
              alt=""
              className="w-full rounded-acepCard border border-slate-200 bg-slate-50"
            />
          )}

          {r.firstDownload && (
            <div className="mt-6">
              <a
                href={r.firstDownload.href}
                target={r.firstDownload.href.startsWith("http") ? "_blank" : undefined}
                rel={r.firstDownload.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-acepBtn border border-acep-primary bg-acep-primary/5 px-4 py-3 text-sm font-semibold text-acep-primary hover:bg-acep-primary/10 transition"
              >
                {r.firstDownload.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveFecBrochurePage();
  if (!r) return { title: "ACEP" };
  return { title: r.seoTitle, description: r.seoDescription };
}
