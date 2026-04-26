"use client";

import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function ContractsMap() {
  return (
    <Card className="p-6 sm:p-8">
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-slate-100 to-acep-primary/10 rounded-acepCard overflow-hidden border-2 border-slate-200">
        {/* Placeholder Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-acep-primary mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Interactive Map Coming Soon
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto px-4">
              An interactive map showing all 15 petroleum contract areas will be available here.
              Map integration using Mapbox/Leaflet will be added in Phase 2.
            </p>
          </div>
        </div>

        {/* Mock Map Elements */}
        <div className="absolute top-4 left-4 bg-white rounded-acepCard shadow-md p-3 sm:p-4 max-w-xs">
          <h4 className="font-semibold text-sm mb-2">Legend</h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Contracts (7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>In Development (7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span>Inactive (1)</span>
            </div>
          </div>
        </div>

        {/* Mock Ghana Outline */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified Ghana shape */}
          <path
            d="M200 50 L250 100 L280 200 L270 350 L200 450 L130 350 L120 200 L150 100 Z"
            fill="#1e3a8a"
            stroke="#1e3a8a"
            strokeWidth="2"
          />
        </svg>
      </div>
    </Card>
  );
}
