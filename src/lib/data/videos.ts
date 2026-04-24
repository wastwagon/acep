export interface Video {
  id: number;
  title: string;
  category: "Tracking The Oil Money" | "Education" | "General Infrastructure" | "Agriculture" | "All";
  description: string;
  youtubeId: string; // For Phase 2 integration
  thumbnail: string;
  duration: string;
  views: number;
  publishedDate: string;
  location: string;
}

export const videos: Video[] = [
  {
    id: 1,
    title: "Campus Rally, University for Development Studies, Wa campus",
    category: "Tracking The Oil Money",
    description: "ACEP organizes campus rally to educate students on oil revenue utilization",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "12:45",
    views: 15420,
    publishedDate: "2024-11-15",
    location: "Wa, Upper West Region",
  },
  {
    id: 2,
    title: "KEYIME IRRIGATION",
    category: "Agriculture",
    description: "Tracking oil-funded irrigation project in Keyime community",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "15:20",
    views: 23100,
    publishedDate: "2024-10-22",
    location: "Keyime, Upper East Region",
  },
  {
    id: 3,
    title: "OHAWU IRRIGATION",
    category: "Agriculture",
    description: "Impact assessment of Ohawu irrigation dam funded by oil revenue",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "18:30",
    views: 19840,
    publishedDate: "2024-09-18",
    location: "Ohawu, Northern Region",
  },
  {
    id: 4,
    title: "OKYEREKO - Tracking The Oil Revenues",
    category: "Tracking The Oil Money",
    description: "Community infrastructure project funded by Ghana's oil revenue",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "14:15",
    views: 28650,
    publishedDate: "2024-08-05",
    location: "Okyereko, Central Region",
  },
  {
    id: 5,
    title: "TWIFO AYAASE METHODIST PRIM",
    category: "Education",
    description: "School infrastructure development using oil revenue allocation",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "11:50",
    views: 12340,
    publishedDate: "2024-07-12",
    location: "Twifo Ayaase, Central Region",
  },
  {
    id: 6,
    title: "OTUAM - Tracking The Oil Revenues",
    category: "General Infrastructure",
    description: "Water and sanitation projects funded by oil revenue in Otuam",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "16:40",
    views: 31250,
    publishedDate: "2024-06-28",
    location: "Otuam, Central Region",
  },
  {
    id: 7,
    title: "OilMoneyTv: Zakpalsi Irrigation Project",
    category: "Agriculture",
    description: "Comprehensive look at the Zakpalsi irrigation dam project",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "22:15",
    views: 45680,
    publishedDate: "2024-05-14",
    location: "Zakpalsi, Northern Region",
  },
  {
    id: 8,
    title: "OilMoneyTv: Zuedem Irrigation Project",
    category: "Agriculture",
    description: "Documenting the transformative Zuedem irrigation infrastructure",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "20:35",
    views: 38920,
    publishedDate: "2024-04-20",
    location: "Zuedem, Upper East Region",
  },
  {
    id: 9,
    title: "Improving Efficiency In The Utilization Of Oil Revenue - The Role Of VFM",
    category: "Tracking The Oil Money",
    description: "Analysis of value for money in oil revenue projects",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "14:39",
    views: 8750,
    publishedDate: "2024-03-08",
    location: "Accra, Greater Accra",
  },
  {
    id: 10,
    title: "MAINSTREAMING DISABILITY ISSUES IN GHANA",
    category: "Tracking The Oil Money",
    description: "How oil-funded projects consider persons with disabilities",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "17:25",
    views: 14230,
    publishedDate: "2024-02-15",
    location: "Various Locations",
  },
  {
    id: 11,
    title: "Impact Of Oil-Funded Projects On PWDs",
    category: "Tracking The Oil Money",
    description: "Documentary on accessibility and inclusivity in oil-funded projects",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "19:50",
    views: 11680,
    publishedDate: "2024-01-22",
    location: "Various Locations",
  },
  {
    id: 12,
    title: "Dawa Irrigation Project - ACEP threatens legal action",
    category: "Agriculture",
    description: "ACEP investigates contractor performance on Dawa irrigation project",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/api/placeholder/400/300",
    duration: "13:20",
    views: 22450,
    publishedDate: "2023-12-10",
    location: "Dawa, Northern Region",
  },
];

export function getVideosByCategory(category: Video["category"]): Video[] {
  if (category === "All") return videos;
  return videos.filter((video) => video.category === category);
}

export function getVideoById(id: number): Video | undefined {
  return videos.find((video) => video.id === id);
}

export function getTotalViews(): number {
  return videos.reduce((total, video) => total + video.views, 0);
}
