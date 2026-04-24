import { getOilRevenuePage } from "@/lib/data/oil-revenue-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function ContactPage() {
  const page = getOilRevenuePage("contact");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/oil-revenue"
        backLabel="Back to Oil Revenue"
        title="Contact us"
        subtitle="Get in touch with questions or feedback about oil revenue transparency."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Contact information
                </CardTitle>
                <CardDescription>Reach out for inquiries or feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 25).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      Contact us for questions, feedback, or inquiries about Ghana&apos;s oil revenue management and
                      transparency initiatives.
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
