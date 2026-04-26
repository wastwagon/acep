import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveEiccgPage } from "@/lib/resolve-marketing-content";
import { acepHrefToLocalPath } from "@/lib/acep-extract";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveEiccgPage();
  if (!r) return { title: "ACEP" };
  return { title: r.seoTitle, description: r.seoDescription };
}

export default async function EiccgFundPage() {
  const r = await resolveEiccgPage();
  if (!r) notFound();

  const apply = r.applyLink!;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{r.title}</h1>
          {r.intro && <p className="mt-3 text-base text-slate-600">{r.intro}</p>}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {r.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.heroImage}
                alt=""
                className="w-full rounded-acepCard border border-slate-200 bg-slate-50"
              />
            )}

            <div className="mt-8 rounded-acepCard border border-slate-200 bg-white p-6">
              <div
                className="acep-rich prose prose-slate max-w-none prose-a:text-acep-primary"
                dangerouslySetInnerHTML={{ __html: r.contentHtml }}
              />
            </div>

            {r.downloads.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {r.downloads.map((d) => (
                  <a
                    key={d.href}
                    href={d.href}
                    target={d.href.startsWith("http") ? "_blank" : undefined}
                    rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center rounded-acepBtn border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-acep-primary/30 hover:bg-slate-50 transition"
                  >
                    {d.text || "Download"}
                  </a>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {apply && (
                <div className="rounded-acepCard border border-slate-200 p-5">
                  <a
                    href={apply.href.startsWith("http") ? apply.href : acepHrefToLocalPath(apply.href)}
                    className="inline-flex w-full items-center justify-center rounded-acepBtn bg-acep-primary px-4 py-3 text-sm font-semibold text-white hover:bg-acep-primary/90 transition"
                    target={apply.href.startsWith("http") ? "_blank" : undefined}
                    rel={apply.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {apply.text}
                  </a>
                </div>
              )}

              <div className="rounded-acepCard border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">Programs</div>
                <div className="space-y-2 text-sm">
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/programs">
                    All programmes
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
