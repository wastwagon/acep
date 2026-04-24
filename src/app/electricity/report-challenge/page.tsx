import { ComplaintForm } from "@/components/electricity/complaint-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function ReportChallengePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Report a challenge"
        subtitle="Help us improve Ghana&apos;s power sector by reporting electricity challenges in your area."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Report power issues
                </CardTitle>
                <CardDescription>
                  Report issues in your access to power, meter challenges, electricity tariffs, service quality, and
                  more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
