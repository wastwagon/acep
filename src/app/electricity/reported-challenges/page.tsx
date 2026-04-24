import { getElectricityPage } from "@/lib/data/electricity-pages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function ReportedChallengesPage() {
  const page = getElectricityPage("reported-challenges");
  const content = page?.content?.text || "";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Reported challenges"
        subtitle="ACEP&apos;s electricity monitor offers valuable data on Ghana&apos;s power sector."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Reported challenges
                </CardTitle>
                <CardDescription>Power sector issues and complaints from consumers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap text-slate-700">
                      {content.split("\n").filter((line) => line.trim()).slice(0, 25).join("\n")}
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      ACEP&apos;s electricity monitor offers valuable data on Ghana&apos;s power sector and invites
                      electric power consumers to report issues in their access to power, meter challenges,
                      electricity tariffs, service quality, and more.
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <Link
                    href="/electricity/report-challenge"
                    className={cn(buttonVariants({ size: "lg" }), "inline-flex w-full rounded-full sm:w-auto")}
                  >
                    Report a challenge
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
