import { getElectricityPage } from "@/lib/data/electricity-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function GenerationPage() {
  const page = getElectricityPage("generation");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Electric power generation"
        subtitle={page?.title || "Electricity generation in Ghana"}
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Generation overview
                </CardTitle>
                <CardDescription>Electricity generation trends and capacity in Ghana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 20).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      Electricity generation in Ghana has historically relied heavily on hydro and thermal sources.
                      Nevertheless, there has been a deliberate shift towards incorporating more renewable energy sources
                      over the past decade, driven by a desire to diversify the energy mix.
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
