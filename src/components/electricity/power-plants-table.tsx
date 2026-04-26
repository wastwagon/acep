"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { powerPlants, type PowerPlant } from "@/lib/data/electricity";
import { MapPin, Zap } from "lucide-react";

export function PowerPlantsTable() {
  const [filter, setFilter] = useState<"All" | PowerPlant["type"]>("All");

  const filteredPlants = filter === "All" 
    ? powerPlants 
    : powerPlants.filter((plant) => plant.type === filter);

  const typeColors = {
    "Hydro Power Plant": "bg-blue-100 text-blue-800",
    "Thermal Power Plant": "bg-orange-100 text-orange-800",
    "Solar Power Plant": "bg-yellow-100 text-yellow-800",
    "Wind Power Plant": "bg-green-100 text-green-800",
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {["All", "Hydro Power Plant", "Thermal Power Plant"].map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            onClick={() => setFilter(type as typeof filter)}
            className="text-sm"
          >
            {type}
            {type !== "All" && (
              <span className="ml-2 text-xs">
                ({powerPlants.filter((p) => p.type === type).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Mobile: Card View */}
      <div className="lg:hidden space-y-4">
        {filteredPlants.map((plant) => (
          <Card key={plant.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-900 text-sm flex-1 pr-2">
                {plant.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-acepBtn font-medium ${typeColors[plant.type]}`}>
                {plant.type.replace(" Power Plant", "")}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start text-slate-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{plant.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <div className="text-xs text-slate-500">Installed</div>
                  <div className="font-semibold text-slate-900">{plant.installedCapacity} MW</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Dependable</div>
                  <div className="font-semibold text-slate-900">{plant.dependableCapacity} MW</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop: Table View */}
      <Card className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Power Station
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Installed Capacity (MW)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Dependable Capacity (MW)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPlants.map((plant) => (
                <tr key={plant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-orange-500 mr-3" />
                      <span className="font-medium text-slate-900">{plant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {plant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-acepBtn text-xs font-medium ${typeColors[plant.type]}`}>
                      {plant.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {plant.installedCapacity}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {plant.dependableCapacity}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-300">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-bold text-slate-900">
                  Total:
                </td>
                <td className="px-6 py-4 text-right font-bold text-orange-600">
                  {filteredPlants.reduce((sum, plant) => sum + plant.installedCapacity, 0).toFixed(3)} MW
                </td>
                <td className="px-6 py-4 text-right font-bold text-orange-600">
                  {filteredPlants.reduce((sum, plant) => sum + plant.dependableCapacity, 0).toFixed(3)} MW
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No power plants found for this filter.</p>
        </div>
      )}
    </div>
  );
}
