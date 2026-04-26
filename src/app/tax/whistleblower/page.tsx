import { WhistleblowerForm } from "@/components/tax/whistleblower-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, DollarSign } from "lucide-react";
import { taxStats } from "@/lib/data/tax";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";

export default function WhistleblowerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/tax"
        backLabel="Back to OpenTax"
        title="Whistleblower program"
        subtitle="Report tax violations confidentially and earn rewards from GH¢25,000 to GH¢250,000."
      />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Program Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="mr-2 h-5 w-5 text-acep-primary" />
                    Reward Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    GH¢25K - GH¢250K
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Based on recovered amounts
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-700" />
                    Validated Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {taxStats.whistleblowerRewards.validatedReports}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Out of {taxStats.whistleblowerRewards.totalReports} total
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="mr-2 h-5 w-5 text-acep-logoPurple" />
                    Total Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    GH¢{taxStats.whistleblowerRewards.totalPaid.toFixed(1)}M
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    In rewards distributed
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How the Whistleblower Program Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-acepBtn bg-acep-primary/10">
                      <span className="font-bold text-acep-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Submit Your Report</h4>
                      <p className="text-sm text-slate-600">
                        Provide detailed information about the tax violation, including entity name, 
                        violation type, and any supporting evidence.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-acepBtn bg-acep-primary/10">
                      <span className="font-bold text-acep-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Review & Validation</h4>
                      <p className="text-sm text-slate-600">
                        Our team reviews your report and validates the information. This process 
                        may take 30-90 days depending on complexity.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-acepBtn bg-acep-primary/10">
                      <span className="font-bold text-acep-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Recovery & Reward</h4>
                      <p className="text-sm text-slate-600">
                        Once taxes are recovered, you receive your reward. Rewards are calculated 
                        as a percentage of the recovered amount.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protection Information */}
            <Card className="mb-8 border-slate-200 bg-acep-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="mr-2 h-5 w-5 text-acep-primary" />
                  Your Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-acep-primary" />
                    <span>All reports are kept strictly confidential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-acep-primary" />
                    <span>You can choose to remain anonymous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-acep-primary" />
                    <span>Whistleblower protection laws apply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-acep-primary" />
                    <span>No retaliation against whistleblowers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Report Form */}
            <WhistleblowerForm />
          </div>
        </div>
      </section>
    </div>
  );
}
