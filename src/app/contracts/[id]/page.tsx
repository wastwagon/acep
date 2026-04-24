import { notFound } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, MapPin, Building2, Calendar, CheckCircle2, Clock, XCircle, FileText, DollarSign, Users, CalendarDays } from "lucide-react";
import { getContractById } from "@/lib/data/contracts";

const statusConfig = {
  Active: {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50",
    label: "Active",
  },
  "In Development": {
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
    label: "In Development",
  },
  Inactive: {
    icon: XCircle,
    color: "text-slate-600 bg-slate-50",
    label: "Inactive",
  },
};

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const contract = getContractById(parseInt(params.id));

  if (!contract) {
    notFound();
  }

  const StatusIcon = statusConfig[contract.status].icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-acep-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/contracts"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-6 -ml-2 text-white hover:bg-white/10 hover:text-acep-secondary",
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all contracts
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm sm:text-base font-semibold bg-acep-secondary px-4 py-1 rounded-full">
                  {contract.block}
                </span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusConfig[contract.status].color}`}>
                  <StatusIcon className="h-4 w-4" />
                  <span>{statusConfig[contract.status].label}</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {contract.name}
              </h1>
              <div className="flex items-center text-lg text-slate-200">
                <MapPin className="h-5 w-5 mr-2" />
                {contract.location}
              </div>
            </div>
            <Button variant="secondary" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Contract
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Overview</CardTitle>
                <CardDescription>Detailed information about this petroleum contract area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Contract Area Size</h3>
                    <p className="text-2xl font-bold text-slate-900">{contract.size.toLocaleString()} km²</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Block Type</h3>
                    <p className="text-2xl font-bold text-slate-900">{contract.block}</p>
                  </div>
                  {contract.discovered && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 mb-2">Year Discovered</h3>
                      <p className="text-2xl font-bold text-slate-900">{contract.discovered}</p>
                    </div>
                  )}
                  {contract.production && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 mb-2">Production Start</h3>
                      <p className="text-2xl font-bold text-slate-900">{contract.production}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Operators Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-acep-primary" />
                  Operators
                </CardTitle>
                <CardDescription>Companies operating in this contract area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contract.operators.map((operator, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-acep-primary/10 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-acep-primary" />
                        </div>
                        <span className="font-semibold text-slate-900">{operator}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contract Parties Card */}
            {contract.parties && contract.parties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-acep-primary" />
                    Contract Parties
                  </CardTitle>
                  <CardDescription>Companies and entities involved in this contract</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contract.parties.map((party, index) => (
                      <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <Building2 className="h-4 w-4 mr-2 text-acep-primary" />
                        <span className="text-sm font-medium text-slate-900">{party}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contract Terms Card */}
            {(contract.effectiveDate || contract.initialExplorationPeriod || contract.minimumExplorationProgram?.length || contract.minimumExpenditure) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-acep-primary" />
                    Contract Terms
                  </CardTitle>
                  <CardDescription>Key terms and obligations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contract.effectiveDate && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1 flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Effective Date
                      </h4>
                      <p className="text-base text-slate-900">{contract.effectiveDate}</p>
                    </div>
                  )}

                  {contract.initialExplorationPeriod && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Initial Exploration Period
                      </h4>
                      <p className="text-base text-slate-900">{contract.initialExplorationPeriod}</p>
                    </div>
                  )}

                  {contract.minimumExplorationProgram && contract.minimumExplorationProgram.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-2">Minimum Exploration Program</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {contract.minimumExplorationProgram.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {contract.minimumExpenditure && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Minimum Expenditure
                      </h4>
                      <p className="text-base text-slate-900">${contract.minimumExpenditure}</p>
                    </div>
                  )}

                  {contract.surfaceRental && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Surface Rental
                      </h4>
                      <p className="text-base text-slate-900">${contract.surfaceRental}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Yearly Updates Card */}
            {contract.updates && Object.keys(contract.updates).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contract Updates</CardTitle>
                  <CardDescription>Yearly status updates and developments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(contract.updates)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([year, update]) => (
                        <div key={year} className="border-l-4 border-acep-primary pl-4">
                          <h4 className="text-lg font-semibold text-slate-900 mb-2">{year} Update</h4>
                          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
                            {update}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contract Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Additional information and terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm sm:prose max-w-none">
                  <p className="text-slate-600">
                    The {contract.name} ({contract.block}) is a {contract.size.toLocaleString()} square kilometer petroleum contract area located in the {contract.location}.
                  </p>
                  
                  {contract.discovered && (
                    <p className="text-slate-600">
                      Oil was discovered in this block in {contract.discovered}
                      {contract.production && ` and production commenced in ${contract.production}`}.
                    </p>
                  )}

                  <p className="text-slate-600">
                    The block is currently operated by {contract.operators.join(", ")}.
                  </p>

                  {contract.sourceUrl && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <a
                        href={contract.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-acep-primary hover:underline"
                      >
                        View original contract page on ghanacontractmonitor.com →
                      </a>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-amber-900 font-medium">
                      📄 Full contract documents and terms will be available for download in Phase 2 of the platform development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-1">Status</h4>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[contract.status].color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span>{statusConfig[contract.status].label}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-1">Location</h4>
                  <p className="text-sm text-slate-900">{contract.location}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-1">Block Code</h4>
                  <p className="text-sm font-mono font-semibold text-acep-primary">{contract.block}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-1">Contract Area</h4>
                  <p className="text-sm text-slate-900">{contract.size.toLocaleString()} km²</p>
                </div>

                {contract.coordinates && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-600 mb-1">Coordinates</h4>
                    <p className="text-xs font-mono text-slate-700">
                      {contract.coordinates.lat.toFixed(4)}°N, {Math.abs(contract.coordinates.lng).toFixed(4)}°W
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-slate-200">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-acep-primary mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Map view coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Contract PDF
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Timeline
                </Button>
                <Button className="w-full" variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
