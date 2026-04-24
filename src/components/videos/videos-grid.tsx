"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { videos, type Video } from "@/lib/data/videos";
import { Play, MapPin, Eye, Calendar } from "lucide-react";

const categories = [
  "All",
  "Tracking The Oil Money",
  "Agriculture",
  "Education",
  "General Infrastructure",
] as const;

const categoryColors = {
  "Tracking The Oil Money": "bg-acep-primary/10 text-acep-primary",
  "Education": "bg-acep-logoPurple/10 text-acep-logoPurple",
  "General Infrastructure": "bg-acep-secondary/15 text-acep-dark",
  "Agriculture": "bg-emerald-100 text-emerald-900",
  "All": "bg-slate-100 text-slate-800",
};

export function VideosGrid() {
  const [filter, setFilter] = useState<typeof categories[number]>("All");

  const filteredVideos = filter === "All" 
    ? videos 
    : videos.filter((video) => video.category === filter);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            onClick={() => setFilter(category)}
            className="text-xs sm:text-sm"
          >
            {category}
            <span className="ml-2 text-xs">
              ({category === "All" ? videos.length : videos.filter((v) => v.category === category).length})
            </span>
          </Button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="group cursor-pointer overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-acep-primary/30 hover:shadow-xl">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-acep-primary/10">
              {/* Placeholder for video thumbnail */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Play className="mx-auto mb-2 h-12 w-12 text-acep-primary" />
                  <div className="px-2 text-xs text-slate-600">Video Thumbnail</div>
                </div>
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <Play className="ml-1 h-8 w-8 text-acep-primary" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 left-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[video.category]}`}>
                  {video.category.replace(" The Oil Money", "")}
                </span>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-acep-primary sm:text-base">
                {video.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3">
                {video.description}
              </p>

              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{video.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{(video.views / 1000).toFixed(1)}K views</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(video.publishedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No videos found for this category.</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 rounded-xl border border-slate-200 bg-gradient-to-br from-acep-primary to-blue-950 p-8 text-center text-white shadow-sm">
        <h3 className="font-display mb-4 text-2xl font-semibold sm:text-3xl">
          Subscribe to OilMoneyTV
        </h3>
        <p className="mx-auto mb-6 max-w-2xl text-slate-100">
          Stay updated with our latest documentaries on how Ghana&apos;s oil revenue is transforming communities across the country
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-amber-900">
            <strong>Phase 2:</strong> YouTube integration will be added to play videos directly on the platform. For now, video thumbnails and metadata are displayed for demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
