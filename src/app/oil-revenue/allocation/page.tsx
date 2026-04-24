import { getOilRevenuePage } from "@/lib/data/oil-revenue-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function AllocationPage() {
  const page = getOilRevenuePage("allocation");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/oil-revenue"
        backLabel="Back to Oil Revenue"
        title="Revenue allocation"
        subtitle="How Ghana&apos;s petroleum revenues are distributed across key sectors."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Allocation overview
                </CardTitle>
                <CardDescription>Comprehensive breakdown of revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 40).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      A comprehensive breakdown of how petroleum revenues are distributed across key sectors in Ghana,
                      ensuring transparency and accountability in resource management.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
