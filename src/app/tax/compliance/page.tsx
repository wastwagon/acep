import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { taxStats } from "@/lib/data/tax";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function CompliancePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/tax"
        backLabel="Back to OpenTax"
        title="Tax compliance"
        subtitle="Information on tax compliance, registration, and filing requirements."
      />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Compliance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                    Registered Taxpayers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {taxStats.totalTaxpayers.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Individuals and businesses
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                    Compliance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">87.5%</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Average compliance rate
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                    Active Businesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {taxStats.activeBusinesses.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Registered businesses
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Information */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance Requirements</CardTitle>
                <CardDescription>
                  Essential information for taxpayers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Registration</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>All businesses must register with GRA within 30 days of commencement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Individual taxpayers earning above threshold must register for TIN</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Online registration available at gra.gov.gh</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Filing Requirements</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Monthly VAT returns due by 20th of following month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Annual income tax returns due by 4 months after year-end</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Electronic filing available through GRA portal</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment Options</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Online payment through GRA portal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Mobile money (MTN, Vodafone, AirtelTigo)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Bank branches and designated payment points</span>
                      </li>
                    </ul>
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
