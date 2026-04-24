import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Shield, Eye, Users } from "lucide-react";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/tax"
        backLabel="Back to OpenTax"
        title="About OpenTax"
        subtitle="Promoting transparency and accountability in Ghana&apos;s tax system."
      />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  OpenTax is a transparency platform dedicated to promoting accountability in Ghana&apos;s 
                  tax collection system. We empower citizens to track tax revenue, understand how taxes are 
                  collected and utilized, and report violations through our confidential whistleblower program.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Eye className="mr-2 h-5 w-5 text-acep-primary" />
                    Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Making tax revenue data accessible and understandable to all citizens
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Shield className="mr-2 h-5 w-5 text-acep-secondary" />
                    Accountability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Ensuring tax compliance through citizen engagement and reporting
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="mr-2 h-5 w-5 text-acep-logoPurple" />
                    Citizen Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Empowering citizens to participate in tax governance
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Tax Revenue Tracking</h3>
                    <p className="text-sm text-slate-600">
                      Comprehensive dashboards showing tax collection trends, revenue sources, 
                      and performance metrics from 2019 to 2024.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Whistleblower Program</h3>
                    <p className="text-sm text-slate-600">
                      Confidential reporting system with rewards ranging from GH¢25,000 to GH¢250,000 
                      for validated reports leading to tax recovery.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Compliance Information</h3>
                    <p className="text-sm text-slate-600">
                      Resources and guidance on tax registration, filing requirements, and payment 
                      options to help taxpayers comply with regulations.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Data Visualization</h3>
                    <p className="text-sm text-slate-600">
                      Interactive charts and graphs to understand tax revenue trends, sources, 
                      and allocation patterns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
