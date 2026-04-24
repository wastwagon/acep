export type MegaSubLink = {
  name: string;
  href: string;
  description?: string;
  /** Card thumbnail in mega menu */
  image: string;
};

export type NavItemWithMega = {
  name: string;
  href: string;
  coverImage: string;
  coverEyebrow: string;
  coverHref: string;
  submenu: MegaSubLink[];
};

export type NavItemSimple = {
  name: string;
  href: string;
};

export type NavItem = NavItemWithMega | NavItemSimple;

export function hasMegaMenu(item: NavItem): item is NavItemWithMega {
  return "submenu" in item && Array.isArray(item.submenu);
}

/** Shared paths (also used on homepage sections) */
const IMG = {
  forum: "/acep-assets/wp-content/uploads/2024/06/Public-Forum.jpg",
  oil: "/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg",
  fec: "/acep-assets/wp-content/uploads/2025/12/FEC-2025-feature-image.png",
  nextgen: "/acep-assets/wp-content/uploads/2024/05/2024-Sumer-School-Feature-Img-1.jpg",
} as const;

export const NAV_ITEMS: NavItem[] = [
  {
    name: "About Us",
    href: "/about-us",
    coverImage: IMG.forum,
    coverEyebrow: "Who we are",
    coverHref: "/about-us",
    submenu: [
      { name: "The Organisation", href: "/the-organisation", image: IMG.oil, description: "Mission, mandate & history" },
      { name: "Governing Board", href: "/governing-board", image: IMG.forum, description: "Leadership & oversight" },
      { name: "Our Team", href: "/team", image: IMG.nextgen, description: "Researchers & programme staff" },
      { name: "Our Partners", href: "/our-partners", image: IMG.fec, description: "Collaborators across sectors" },
    ],
  },
  {
    name: "Resource Centre",
    href: "/resource-centre",
    coverImage: IMG.oil,
    coverEyebrow: "Evidence & media",
    coverHref: "/resource-centre",
    submenu: [
      { name: "Publications", href: "/publications", image: IMG.oil, description: "Research, briefs & reports" },
      { name: "Photo Gallery", href: "/photo-gallery", image: IMG.forum, description: "Field work & events" },
      { name: "Video Gallery", href: "/video-gallery", image: IMG.fec, description: "Films & highlights" },
    ],
  },
  {
    name: "Programs",
    href: "/programs",
    coverImage: IMG.fec,
    coverEyebrow: "What we run",
    coverHref: "/programs",
    submenu: [
      { name: "Events", href: "/events", image: IMG.forum, description: "Conferences & public forums" },
      { name: "FEC 2025", href: "/fec-2025", image: IMG.fec, description: "Future of Energy Conference" },
      { name: "NextGen Program", href: "/nextgen10", image: IMG.nextgen, description: "Young leaders in governance" },
      { name: "Africa Climate Academy", href: "/climate-academy", image: IMG.oil, description: "Climate & transition" },
      { name: "AFREIKH Summer School", href: "/2025-afreikh-summer-school", image: IMG.nextgen, description: "Regional summer school" },
      { name: "Resource Governance Hub", href: "/rgchub", image: IMG.oil, description: "RG campus hub" },
      { name: "EICCG Fund", href: "/eiccg-fund", image: IMG.fec, description: "Energy investment facility" },
    ],
  },
  { name: "Publications", href: "/publications" },
  { name: "Events", href: "/events" },
  {
    name: "Platforms",
    href: "#",
    coverImage: IMG.oil,
    coverEyebrow: "Live data",
    coverHref: "/contracts",
    submenu: [
      { name: "Petroleum Contract Monitor", href: "/contracts", image: IMG.oil, description: "Track 15 contract areas" },
      { name: "Electricity Monitor", href: "/electricity", image: IMG.fec, description: "Power sector & complaints" },
      { name: "Our Oil Money", href: "/oil-revenue", image: IMG.oil, description: "Revenue tracking" },
      { name: "OpenTax", href: "/tax", image: IMG.nextgen, description: "Tax transparency" },
      { name: "OilMoneyTV", href: "/videos", image: IMG.forum, description: "Documentaries & explainers" },
    ],
  },
];
