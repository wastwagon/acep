import { getElectricityPage } from "@/lib/data/electricity-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function ConsumptionPage() {
  const page = getElectricityPage("consumption");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Electric power consumption"
        subtitle="Ghana&apos;s electricity consumption has grown significantly over the years."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Consumption overview
                </CardTitle>
                <CardDescription>Electricity consumption trends and customer data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 20).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      Ghana&apos;s electricity consumption has grown significantly over the years, with customers
                      increasing from 932,598 in 2000 to 5,566,711 in 2022 at an annual average growth rate of 8.5%.
                      Residential customers are the largest.
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
