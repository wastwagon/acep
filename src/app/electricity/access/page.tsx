import { getElectricityPage } from "@/lib/data/electricity-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function AccessPage() {
  const page = getElectricityPage("access");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Electric power access"
        subtitle="Ghana aims to achieve universal electricity access by 2025."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Access to electricity in Ghana
                </CardTitle>
                <CardDescription>National Electrification Scheme progress and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 25).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      The National Electrification Scheme (NES), launched in 1989 to ensure reliable electricity supply
                      across Ghana by 2020, has played a pivotal role in expanding access nationwide and advancing
                      Sustainable Development Goal 7 (SDG 7).
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
