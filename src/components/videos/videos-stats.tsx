import { Video, Play, Eye, Calendar } from "lucide-react";
import { videos, getTotalViews } from "@/lib/data/videos";
import { formatNumber } from "@/lib/utils";

export function VideosStats() {
  const totalVideos = videos.length;
  const totalViews = getTotalViews();
  const categories = [...new Set(videos.map((v) => v.category))].filter((c) => c !== "All").length;

  const stats = [
    {
      icon: Video,
      value: `${totalVideos}+`,
      label: "Video Documentaries",
      sublabel: "Mini docs available",
      color: "from-acep-primary to-blue-900",
    },
    {
      icon: Eye,
      value: formatNumber(totalViews),
      label: "Total Views",
      sublabel: "And growing",
      color: "from-acep-logoPurple to-acep-primary",
    },
    {
      icon: Play,
      value: categories,
      label: "Categories",
      sublabel: "Different themes",
      color: "from-acep-secondary to-acep-logoOrange",
    },
    {
      icon: Calendar,
      value: "2010-2024",
      label: "Coverage Period",
      sublabel: "Since oil production",
      color: "from-acep-primary to-acep-secondary",
    },
  ];

  return (
    <section className="relative z-20 bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-acepCard border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-acepBtn shadow-lg`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-8 rounded-acepCard border border-slate-200 bg-gradient-to-r from-slate-50 to-acep-primary/5 p-6">
          <h3 className="mb-2 text-center text-xl font-semibold text-slate-900">
            Our Mission
          </h3>
          <p className="text-slate-700 text-center max-w-3xl mx-auto">
            To educate the Ghanaian masses on how revenue from Ghana&apos;s oil field is spent and distributed across all sectors of the economy through compelling video documentaries
          </p>
        </div>
      </div>
    </section>
  );
}
