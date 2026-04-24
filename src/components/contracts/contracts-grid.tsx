"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { contractAreas, type ContractArea } from "@/lib/data/contracts";

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

export function ContractsGrid() {
  const [filter, setFilter] = useState<"All" | ContractArea["status"]>("All");

  const filteredContracts = filter === "All" 
    ? contractAreas 
    : contractAreas.filter((contract) => contract.status === filter);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {["All", "Active", "In Development", "Inactive"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status as typeof filter)}
            className="text-sm sm:text-base"
          >
            {status}
            {status !== "All" && (
              <span className="ml-2 text-xs">
                ({contractAreas.filter((c) => c.status === status).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContracts.map((contract) => {
          const StatusIcon = statusConfig[contract.status].icon;
          
          return (
            <Link key={contract.id} href={`/contracts/${contract.id}`} className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-acep-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusConfig[contract.status].color}`}>
                      <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{statusConfig[contract.status].label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-acep-primary bg-acep-primary/10 px-3 py-1 rounded-full">
                      {contract.block}
                    </span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-acep-primary transition-colors">
                    {contract.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {contract.location}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Contract Area:</span>
                      <span className="font-semibold text-slate-900">{contract.size.toLocaleString()} km²</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-sm text-slate-600 mb-2">
                        <Building2 className="h-4 w-4 mr-1" />
                        Operators:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {contract.operators.map((operator, index) => (
                          <span
                            key={index}
                            className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                          >
                            {operator}
                          </span>
                        ))}
                      </div>
                    </div>

                    {(contract.discovered || contract.production) && (
                      <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                        {contract.discovered && (
                          <div>Discovered: {contract.discovered}</div>
                        )}
                        {contract.production && (
                          <div>Production Start: {contract.production}</div>
                        )}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full group-hover:bg-acep-primary group-hover:text-white transition-colors mt-2"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No contracts found for this filter.</p>
        </div>
      )}
    </div>
  );
}
