"use client";

import { Card, CardContent } from "@/components/ui/card";
import { taxStats } from "@/lib/data/tax";
import { DollarSign, Users, TrendingUp, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

export function TaxStats() {
  return (
    <section className="py-12 sm:py-16 bg-white -mt-8 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Total Revenue */}
          <Card className="bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-acepBtn bg-gradient-to-br from-acep-primary to-blue-900 p-2 shadow-lg sm:p-3">
                  <DollarSign className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                GH¢{taxStats.totalRevenue2024.toFixed(1)}B
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                2024 Tax Revenue
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                {taxStats.growthRate.toFixed(1)}% growth from 2023
              </div>
            </CardContent>
          </Card>

          {/* Tax to GDP */}
          <Card className="bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-acepBtn bg-gradient-to-br from-acep-secondary to-acep-logoOrange p-2 shadow-lg sm:p-3">
                  <TrendingUp className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {taxStats.taxToGDP.toFixed(1)}%
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                Tax to GDP Ratio
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                Highest in 6 years
              </div>
            </CardContent>
          </Card>

          {/* Total Taxpayers */}
          <Card className="bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-acepBtn bg-gradient-to-br from-acep-logoPurple to-acep-primary p-2 shadow-lg sm:p-3">
                  <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {taxStats.totalTaxpayers.toLocaleString()}
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                Total Taxpayers
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                Registered individuals & businesses
              </div>
            </CardContent>
          </Card>

          {/* Whistleblower Reports */}
          <Card className="bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary p-2 shadow-lg sm:p-3">
                  <Shield className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {taxStats.whistleblowerRewards.totalReports.toLocaleString()}
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                Reports Filed
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                {taxStats.whistleblowerRewards.validatedReports} validated
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Whistleblower Info Banner */}
        <div className="mt-8 rounded-acepCard border border-slate-200 bg-gradient-to-r from-amber-50/80 to-acep-primary/5 p-4 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="mb-1 flex items-center text-lg font-semibold text-slate-900">
                <AlertTriangle className="mr-2 h-5 w-5 text-acep-secondary" aria-hidden />
                Whistleblower Reward Program
              </h3>
              <p className="text-sm text-slate-600">
                Report tax violations and earn rewards from GH¢25,000 to GH¢250,000. 
                All reports are confidential and protected.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="rounded-acepBtn bg-white px-4 py-2 text-center shadow-sm">
                <div className="text-2xl font-bold text-acep-primary">
                  GH¢{taxStats.whistleblowerRewards.minReward.toLocaleString()}
                </div>
                <div className="text-xs text-slate-600">Minimum Reward</div>
              </div>
              <div className="rounded-acepBtn bg-white px-4 py-2 text-center shadow-sm">
                <div className="text-2xl font-bold text-acep-primary">
                  GH¢{taxStats.whistleblowerRewards.maxReward.toLocaleString()}
                </div>
                <div className="text-xs text-slate-600">Maximum Reward</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
