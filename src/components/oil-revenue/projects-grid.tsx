"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sampleProjects, type Project } from "@/lib/data/oil-revenue";
import { MapPin, DollarSign, Users, CheckCircle2, Clock, Calendar } from "lucide-react";

const statusConfig = {
  Completed: {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50",
    label: "Completed",
  },
  Ongoing: {
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
    label: "Ongoing",
  },
  Planned: {
    icon: Calendar,
    color: "bg-acep-primary/10 text-acep-primary",
    label: "Planned",
  },
};

const categoryColors = {
  Infrastructure: "bg-acep-primary/10 text-acep-primary",
  Education: "bg-acep-logoPurple/10 text-acep-logoPurple",
  Health: "bg-acep-secondary/15 text-acep-dark",
  Agriculture: "bg-emerald-50 text-emerald-900",
};

export function ProjectsGrid() {
  const [filter, setFilter] = useState<"All" | Project["category"]>("All");

  const filteredProjects = filter === "All" 
    ? sampleProjects 
    : sampleProjects.filter((project) => project.category === filter);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {["All", "Infrastructure", "Education", "Health", "Agriculture"].map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            onClick={() => setFilter(category as typeof filter)}
            className="text-sm"
          >
            {category}
            {category !== "All" && (
              <span className="ml-2 text-xs">
                ({sampleProjects.filter((p) => p.category === category).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const StatusIcon = statusConfig[project.status].icon;

          return (
            <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500/50 flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[project.category]}`}>
                    {project.category}
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{statusConfig[project.status].label}</span>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl line-clamp-2 hover:text-green-600 transition-colors">
                  {project.name}
                </CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{project.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>Funding:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ${project.fundingAmount}M
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Beneficiaries:</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {project.beneficiaries.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Started: {project.startYear}</span>
                      {project.completionYear && (
                        <span>Completed: {project.completionYear}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No projects found for this category.</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-12 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-acep-primary/5 p-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          See More Projects on OilMoneyTV
        </h3>
        <p className="text-slate-600 mb-4">
          Watch video documentaries showing how oil revenue is transforming communities across Ghana
        </p>
        <Link href="/videos">
          <Button variant="default">View All Videos</Button>
        </Link>
      </div>
    </div>
  );
}
