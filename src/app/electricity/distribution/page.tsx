import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function DistributionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/electricity"
        backLabel="Back to Electricity Monitor"
        title="Electric power distribution"
        subtitle="Electric power distribution in Ghana is mainly spearheaded by the Electricity Company of Ghana (ECG) and the Northern Electricity Distribution Company (NEDCo)."
      />

      <section className="border-b border-slate-200 bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link href="/electricity/distribution/southern">
                <Card className="h-full cursor-pointer transition-shadow hover:border-acep-primary/20 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center font-display text-lg font-medium sm:text-xl">
                      <MapPin className="mr-2 h-5 w-5 text-acep-secondary" aria-hidden />
                      Southern zone
                    </CardTitle>
                    <CardDescription>Electricity distribution in the Southern Zone by ECG</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/electricity/distribution/northern">
                <Card className="h-full cursor-pointer transition-shadow hover:border-acep-primary/20 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center font-display text-lg font-medium sm:text-xl">
                      <MapPin className="mr-2 h-5 w-5 text-acep-secondary" aria-hidden />
                      Northern zone
                    </CardTitle>
                    <CardDescription>Electricity distribution in the Northern Zone by NEDCo</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                  Distribution overview
                </CardTitle>
                <CardDescription>Distribution companies and coverage areas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Electric power distribution in Ghana is mainly spearheaded by the Electricity Company of Ghana (ECG)
                  and the Northern Electricity Distribution Company (NEDCo), with Enclave Power Company (EPC), a private
                  entity, playing a minor role in the distribution chain.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
