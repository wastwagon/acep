"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { powerPlants, getTotalInstalledCapacity, getTotalDependableCapacity } from "@/lib/data/electricity";
import { BarChart3 } from "lucide-react";

export function CapacityChart() {
  // Calculate totals by type
  const hydroPlants = powerPlants.filter((p) => p.type === "Hydro Power Plant");
  const thermalPlants = powerPlants.filter((p) => p.type === "Thermal Power Plant");

  const hydroInstalled = hydroPlants.reduce((sum, p) => sum + p.installedCapacity, 0);
  const thermalInstalled = thermalPlants.reduce((sum, p) => sum + p.installedCapacity, 0);
  const totalInstalled = getTotalInstalledCapacity();

  const hydroPercentage = (hydroInstalled / totalInstalled) * 100;
  const thermalPercentage = (thermalInstalled / totalInstalled) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Capacity Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
            Power Generation Breakdown
          </CardTitle>
          <CardDescription>Installed capacity by power plant type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Hydro Power */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Hydro Power</span>
                <span className="text-sm font-semibold text-blue-600">{hydroInstalled.toFixed(2)} MW</span>
              </div>
              <ProgressBar
                percentage={hydroPercentage}
                variant="blue"
                size="md"
              />
              <div className="mt-1 text-xs text-slate-500">
                {hydroPercentage.toFixed(1)}% • {hydroPlants.length} plants
              </div>
            </div>

            {/* Thermal Power */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Thermal Power</span>
                <span className="text-sm font-semibold text-orange-600">{thermalInstalled} MW</span>
              </div>
              <ProgressBar
                percentage={thermalPercentage}
                variant="orange"
                size="md"
              />
              <div className="mt-1 text-xs text-slate-500">
                {thermalPercentage.toFixed(1)}% • {thermalPlants.length} plants
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">Total Installed</span>
                <span className="text-lg font-bold text-orange-600">{totalInstalled.toFixed(3)} MW</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600">Total Dependable</span>
                <span className="text-base font-semibold text-slate-900">{getTotalDependableCapacity().toFixed(3)} MW</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Distribution Card */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Distribution</CardTitle>
          <CardDescription>Power plants across Ghana&apos;s regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { region: "Western Region", plants: 4, capacity: 1097 },
              { region: "Greater Accra", plants: 2, capacity: 197 },
              { region: "Eastern Region", plants: 2, capacity: 1180 },
              { region: "Bono Region", plants: 1, capacity: 400 },
              { region: "Volta Region", plants: 1, capacity: 0.045 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-acepBtn hover:bg-slate-100 transition-colors">
                <div>
                  <div className="font-medium text-slate-900">{item.region}</div>
                  <div className="text-sm text-slate-500">{item.plants} plants</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-orange-600">{item.capacity} MW</div>
                  <div className="text-xs text-slate-500">Installed</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
