import { getElectricityPage } from "@/lib/data/electricity-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function TransmissionPage() {
  const page = getElectricityPage("transmission");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Electric power transmission"
        subtitle="Transmission delivers power from generation to substations for distribution to homes and businesses."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Transmission overview
                </CardTitle>
                <CardDescription>The Ghana Grid Company (GRIDCo) is responsible for transmission in Ghana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 15).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      Transmission of electrical energy plays a pivotal role in delivering power from its point of
                      generation, such as power plants, to local substations, where it is subsequently distributed to
                      homes and businesses.
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
