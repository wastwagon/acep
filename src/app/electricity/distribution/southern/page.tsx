import { getElectricityPage } from "@/lib/data/electricity-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function DistributionSouthernPage() {
  const page = getElectricityPage("distribution-southern");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity/distribution"
        backLabel="Back to distribution"
        title="Electricity distribution — Southern zone"
        subtitle="Electricity Company of Ghana (ECG) coverage area."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Southern zone distribution
                </CardTitle>
                <CardDescription>ECG service area and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 20).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      The Electricity Company of Ghana (ECG) is responsible for electricity distribution in the southern
                      regions of Ghana.
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
