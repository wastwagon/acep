import { normalizeAcepUrl } from "@/lib/acep-snapshots";
import type { AcepListItem } from "@/lib/acep-extract";
import type { Post } from "@/lib/data/post-types";

/** Public placeholder images — replace with CMS media in production. */
export const PH = {
  hero: "/placeholders/acep-hero-16x9.svg",
  card: "/placeholders/acep-card-4x3.svg",
  square: "/placeholders/acep-square.svg",
} as const;

export function acepKey(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return normalizeAcepUrl(`https://acep.africa${p.endsWith("/") ? p : `${p}/`}`);
}

export type MarketingSeo = { title: string; description: string };

export type MarketingProse = {
  meta: MarketingSeo;
  title: string;
  intro: string;
  heroImage: string;
  contentHtml: string;
};

export type MarketingHubLink = {
  title: string;
  href: string;
  description: string;
  image: string;
};

export type MarketingHub = {
  meta: MarketingSeo;
  title: string;
  intro: string;
  links: MarketingHubLink[];
};

const p = (path: string, body: MarketingProse) => [acepKey(path), body] as const;

const PROSE_PAGES: Record<string, MarketingProse> = Object.fromEntries([
  p("the-organisation", {
    meta: {
      title: "The Organisation | ACEP",
      description:
        "The Africa Centre for Energy Policy (ACEP) is a not-for-profit policy think tank for research, training, and advocacy for transparent, accountable use of energy and natural resources for Africa’s development.",
    },
    title: "The Organisation",
    intro:
      "ACEP is an African think tank with a focus on energy and extractives governance, based in Accra, Ghana, and working with partners across the continent.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Who we are</h2>
      <p>The Africa Centre for Energy Policy (ACEP) exists to help African citizens and institutions hold power to account in the energy and extractive sectors. We generate evidence, convene stakeholders, and engage policy processes so that natural resource wealth supports inclusive, sustainable development rather than opacity and waste.</p>
      <h2>What we do</h2>
      <p>Our work combines policy research, data platforms, and public engagement. We support reform of laws and institutions, strengthen media and civil society, and work with public agencies to improve transparency and service delivery in electricity, petroleum, mining, and related fiscal systems.</p>
      <ul>
        <li><a href="/publications">Publications and analysis</a> on energy transition, revenue management, and industrial competitiveness.</li>
        <li><a href="/programs">Programmes and events</a> that build capacity and connect policy with practice.</li>
        <li><a href="/contracts">Monitoring tools</a> and sector dashboards the public can use to track commitments and performance.</li>
      </ul>
      <h2>How we are governed</h2>
      <p>ACEP is overseen by a <a href="/governing-board">Governing Board</a> and delivered by a multidisciplinary <a href="/team">team</a> of researchers, analysts, and operations staff, working with <a href="/our-partners">partners</a> in government, industry, and civil society.</p>
    `,
  }),
  p("governing-board", {
    meta: {
      title: "Governing Board | ACEP",
      description:
        "Oversight and strategic direction for ACEP: board responsibilities, independence, and accountability in service of our public-interest mandate.",
    },
    title: "Governing Board",
    intro:
      "The Governing Board sets strategic direction, safeguards independence, and ensures ACEP’s work remains aligned with our mission and values.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Role of the board</h2>
      <p>The board approves long-term strategy, key policies, and risk management. It appoints and supports the executive leadership and ensures that financial, legal, and ethical standards are met. Board members serve in a non-executive capacity and are expected to act in the public interest.</p>
      <h2>Independence and integrity</h2>
      <p>ACEP’s credibility rests on transparent governance and clear conflicts-of-interest rules. The board is responsible for maintaining organisational independence from undue influence while engaging constructively with all stakeholders.</p>
      <p>Photographs and member biographies can be added when final assets are available in the CMS. Use the same layout as this page, swapping the hero image in <strong>Admin → Media</strong>.</p>
    `,
  }),
  p("team", {
    meta: {
      title: "Our Team | ACEP",
      description:
        "Meet the researchers, analysts, and programme staff who deliver ACEP’s research, platforms, and training across energy and extractive governance.",
    },
    title: "Our Team",
    intro:
      "ACEP’s team brings together expertise in economics, law, engineering, data, communications, and programme management.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>How we work</h2>
      <p>Research and advocacy are organised in thematic and country-facing programmes. Colleagues collaborate on reports, data tools, events, and media products. Operational teams ensure quality, safety, and compliance across finance, HR, and IT.</p>
      <h2>Directory (placeholder)</h2>
      <p>Profile cards, headshots, and role descriptions will be maintained through the CMS. For now, this page uses a single placeholder image so the layout, headings, and navigation are ready for final content.</p>
      <p>See also: <a href="/the-organisation">The Organisation</a> and <a href="/governing-board">Governing Board</a>.</p>
    `,
  }),
  p("our-partners", {
    meta: {
      title: "Our Partners | ACEP",
      description:
        "ACEP works with funders, academic institutions, civil society, public agencies, and the private sector to advance transparent energy and resource governance.",
    },
    title: "Our Partners",
    intro:
      "Partnerships extend our reach, sharpen our analysis, and help turn evidence into policy change and practical outcomes.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Collaboration</h2>
      <p>We collaborate on research, events, and capacity building. Partners include bilateral and multilateral funders, foundations, universities, and peer organisations working on transparency, climate, and development finance.</p>
      <h2>Logos and case studies</h2>
      <p>When you add partner logos in the CMS, place them in a simple grid or list below this section. You can also link to joint publications in the <a href="/resource-centre">Resource Centre</a>.</p>
    `,
  }),
  p("nextgen10", {
    meta: {
      title: "NextGen Resource Governance Leaders | ACEP",
      description:
        "NextGen develops young professionals in resource governance through training, mentoring, and practical engagement with policy and advocacy.",
    },
    title: "NextGen Resource Governance Leaders Program",
    intro:
      "A flagship programme to prepare the next generation of leaders in extractive and energy sector transparency and reform.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Programme focus</h2>
      <p>NextGen combines coursework, field exposure, and peer learning. Fellows work on real policy questions alongside ACEP staff and partners, building skills in research, communication, and coalition-building.</p>
      <h2>How to engage</h2>
      <p>Calls for applications and schedule updates are published under <a href="/events">Events</a> and the <a href="/news-blog-posts">news feed</a>. For general enquiries, use the site contact options in the footer once connected to your CMS forms.</p>
    `,
  }),
  p("climate-academy", {
    meta: {
      title: "Africa Climate Academy | ACEP",
      description:
        "The Africa Climate Academy convenes learning on climate, energy transition, and just development pathways for African practitioners and stakeholders.",
    },
    title: "The Africa Climate Academy",
    intro:
      "A learning space for evidence-based climate and energy policy, aligned with Africa’s development priorities and international commitments.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Objectives</h2>
      <p>The Academy connects research, policy, and practice on mitigation, adaptation, and finance. Sessions may cover power planning, critical minerals, fiscal instruments, and regional integration.</p>
      <h2>Related work</h2>
      <p>Explore <a href="/future-of-energy-conference">Future of Energy Conference</a> materials in publications, and <a href="/programs">other programmes</a> for upcoming dates.</p>
    `,
  }),
  p("2025-afreikh-summer-school", {
    meta: {
      title: "AFREIKH Summer School 2025 | ACEP",
      description:
        "AFREIKH brings together students and early-career professionals from the region for intensive training in resource and energy governance.",
    },
    title: "AFREIKH Summer School 2025",
    intro:
      "A regional summer school focused on building skills and networks for better governance of Africa’s energy and natural resources.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Format</h2>
      <p>The summer school combines lectures, group work, and site discussions. Topics typically span petroleum fiscal regimes, electricity markets, environmental standards, and civil society strategies.</p>
      <h2>Updates</h2>
      <p>Programme details and application windows will be posted to <a href="/events">Events</a> and <a href="/nextgen10">NextGen</a> as they are confirmed.</p>
    `,
  }),
  p("rgchub", {
    meta: {
      title: "Resource Governance Campus Hub | ACEP",
      description:
        "The Resource Governance Campus Hub links universities and students to resource governance education, research, and campus activities.",
    },
    title: "Resource Governance Campus Hub (RGCHub)",
    intro:
      "Campus-level engagement to strengthen teaching, debate, and student leadership on natural resource and energy governance.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Campus network</h2>
      <p>RGCHub supports lectures, clubs, and collaborative projects with faculty. It helps connect academic calendars with national and regional policy conversations.</p>
      <h2>Get involved</h2>
      <p>Partner institutions and student leaders can reach out through ACEP’s programmes team. Watch <a href="/events">Events</a> for hub-related sessions.</p>
    `,
  }),
  p("eiccg-fund", {
    meta: {
      title: "EICCG Fund | ACEP",
      description:
        "The Energy and Industrialisation Competitive Challenge Grant (EICCG) supports projects that advance industrial energy solutions and competitiveness.",
    },
    title: "EICCG Fund",
    intro:
      "A facility focused on practical projects that improve industrial energy access, efficiency, and cost competitiveness in line with national priorities.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>About the facility</h2>
      <p>The EICCG Fund is designed to bridge analysis and implementation: supporting firms and partners to test approaches that can scale, with clear metrics and learning for policy.</p>
      <h2>Apply and learn more</h2>
      <p>When live application materials are available, they will be linked from this page and from <a href="/programs">Programs</a>. Downloadable guidelines and forms can be managed as media assets in the admin panel.</p>
    `,
  }),
  p("fec-2025", {
    meta: {
      title: "Future of Energy Conference (FEC) | ACEP",
      description:
        "FEC is ACEP’s annual platform for stakeholder collaboration on an inclusive, sustainable energy future for Africa—industrial transformation, costs, and regional integration.",
    },
    title: "Future of Energy Conference",
    intro:
      "An annual platform to drive collaboration on energy transition, industrial competitiveness, and energy access—grounded in African realities and opportunities.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Powering Africa’s industrial transformation</h2>
      <p>The Future of Energy Conference (FEC) is an annual platform to drive stakeholder collaboration towards an inclusive and sustainable energy future for Africa. It explores how to harness the energy transition and the continent’s natural resources to reduce energy poverty and support economic transformation.</p>
      <h2>FEC 2026 focus</h2>
      <p>The programme examines structural drivers of energy costs, infrastructure readiness, and industrial competitiveness, so that value addition and industrialisation are practically achievable. Themes include:</p>
      <ul>
        <li>Structural drivers of industrial energy costs</li>
        <li>Infrastructure readiness and technology pathways</li>
        <li>Regional energy integration</li>
        <li>Financial solutions for projects and customers</li>
      </ul>
      <h2>Related pages</h2>
      <p>Brochure and report downloads: <a href="/fec-brochure">Brochure</a> and <a href="/fec-resource-centre">FEC Resource Centre</a>. <a href="/e">Event registration</a> for ACEP-managed events. <a href="/publications">Publications</a> for past conference outcomes.</p>
    `,
  }),
  p("future-of-energy-conference", {
    meta: {
      title: "Future of Energy Conference | ACEP",
      description:
        "Overview of FEC: themes, participation, and how the conference connects policy, industry, and civil society on Africa’s energy future.",
    },
    title: "Future of Energy Conference",
    intro:
      "FEC convenes decision-makers, practitioners, and communities to discuss energy transition, access, and industrial development in an African context.",
    heroImage: PH.hero,
    contentHtml: `
      <h2>Why it matters</h2>
      <p>Energy choices shape jobs, health, and climate. FEC creates space for honest debate on costs, trade-offs, and the institutions needed for reliable, affordable, and clean energy systems.</p>
      <p>See <a href="/fec-2025">FEC 2025 hub</a> for materials, and <a href="/events">Events</a> for registration and dates.</p>
    `,
  }),
]);

function hub(path: string, body: MarketingHub) {
  return [acepKey(path), body] as const;
}

const HUB_PAGES: Record<string, MarketingHub> = Object.fromEntries([
  hub("about-us", {
    meta: {
      title: "About Us | ACEP",
      description:
        "Learn about ACEP: our organisation, board, team, and partners—working for transparent and accountable energy and extractive sector governance in Africa.",
    },
    title: "About Us",
    intro:
      "ACEP is a policy and advocacy organisation focused on how Africa’s energy and natural resources are governed. Use the links below to explore our structure, people, and collaborations.",
    links: [
      {
        title: "The Organisation",
        href: "/the-organisation",
        description: "Mission, mandate, and how we work with partners across the continent.",
        image: PH.card,
      },
      {
        title: "Governing Board",
        href: "/governing-board",
        description: "Strategic oversight, independence, and public-interest governance.",
        image: PH.card,
      },
      {
        title: "Our Team",
        href: "/team",
        description: "Researchers, analysts, and programme staff delivering our work.",
        image: PH.card,
      },
      {
        title: "Our Partners",
        href: "/our-partners",
        description: "Funders, institutions, and networks we collaborate with.",
        image: PH.card,
      },
    ],
  }),
  hub("programs", {
    meta: {
      title: "Programs | ACEP",
      description:
        "ACEP programmes: events, NextGen, Climate Academy, AFREIKH, campus hub, EICCG, and the Future of Energy Conference.",
    },
    title: "Programs",
    intro:
      "We run conferences, fellowships, summer schools, and grant facilities that connect evidence to policy and build leadership across the energy and extractive sectors.",
    links: [
      { title: "Events", href: "/events", description: "Conferences, forums, and public dialogues.", image: PH.card },
      {
        title: "Event registration (online)",
        href: "/e",
        description: "Register for ACEP-managed events: attendees, exhibitors, speakers.",
        image: PH.card,
      },
      { title: "Future of Energy Conference", href: "/fec-2025", description: "Annual flagship energy conference (FEC).", image: PH.card },
      { title: "NextGen Program", href: "/nextgen10", description: "Young leaders in resource governance.", image: PH.card },
      { title: "Africa Climate Academy", href: "/climate-academy", description: "Climate, transition, and development.", image: PH.card },
      { title: "AFREIKH Summer School", href: "/2025-afreikh-summer-school", description: "Regional summer school.", image: PH.card },
      { title: "Resource Governance Hub", href: "/rgchub", description: "Campus and student engagement.", image: PH.card },
      { title: "EICCG Fund", href: "/eiccg-fund", description: "Industrial energy competitiveness facility.", image: PH.card },
    ],
  }),
  hub("resource-centre", {
    meta: {
      title: "Resource Centre | ACEP",
      description:
        "Publications, press, news, radar, annual reports, and galleries—evidence and media from ACEP’s work on energy and extractive governance.",
    },
    title: "Resource Centre",
    intro:
      "Browse research, statements, and multimedia resources. New items can be highlighted through the CMS and linked from the home page and news sections.",
    links: [
      { title: "Research & Policy Papers", href: "/research-and-policy-papers", description: "In-depth research and policy analysis.", image: PH.card },
      { title: "Press Statements", href: "/press-statements", description: "Official positions and media releases.", image: PH.card },
      { title: "News & Blog Posts", href: "/news-blog-posts", description: "Updates, comment, and features.", image: PH.card },
      { title: "ACEP Radar", href: "/radar", description: "Timely briefs and monitoring pieces.", image: PH.card },
      { title: "Annual Reports", href: "/annual-reports", description: "Organisational reporting and impact.", image: PH.card },
      { title: "Photo Gallery", href: "/photo-gallery", description: "Field work and events (replace images in CMS).", image: PH.card },
      { title: "Video Gallery", href: "/video-gallery", description: "Films and highlights (embeds via CMS as needed).", image: PH.card },
    ],
  }),
]);

export function getProseBuiltin(url: string): MarketingProse | null {
  return PROSE_PAGES[normalizeAcepUrl(url)] ?? null;
}

export function getHubBuiltin(url: string): MarketingHub | null {
  return HUB_PAGES[normalizeAcepUrl(url)] ?? null;
}

export const BUILTIN_EVENT_ITEMS: AcepListItem[] = [
  {
    title: "Future of Energy Conference (placeholder)",
    href: "/fec-2025",
    dateText: "TBA",
    excerpt: "Annual conference on energy transition and industrialisation—replace dates and copy in CMS.",
    imageSrc: PH.card,
  },
  {
    title: "ACEP public forum (placeholder)",
    href: "/events",
    dateText: "TBA",
    excerpt: "National or regional public dialogue—link to a live post when published.",
    imageSrc: PH.card,
  },
  {
    title: "NextGen information session (placeholder)",
    href: "/nextgen10",
    dateText: "TBA",
    excerpt: "Brief fellows and partners on application cycles and programme design.",
    imageSrc: PH.card,
  },
];

export const BUILTIN_RADAR_POSTS: Post[] = [
  {
    url: "https://acep.africa/radar/placeholder-1/",
    title: "Radar brief (sample layout)",
    dateText: new Date().getFullYear().toString(),
    excerpt: "Replace with imported posts or new entries from Admin. This row demonstrates filters and search.",
    pdfLinks: [],
    category: "ACEP Radar",
    tags: [],
    featuredImage: PH.card,
  },
  {
    url: "https://acep.africa/radar/placeholder-2/",
    title: "Energy governance snapshot (sample layout)",
    dateText: new Date().getFullYear().toString(),
    excerpt: "Connect real Radar content via scrape or hand-authored posts; swap featured images in Media.",
    pdfLinks: [],
    category: "ACEP Radar",
    tags: [],
    featuredImage: PH.card,
  },
];

export const BUILTIN_ANNUAL_POSTS: Post[] = [
  {
    url: "https://acep.africa/annual-reports/placeholder-1/",
    title: "Annual report (sample layout)",
    dateText: new Date().getFullYear().toString(),
    excerpt: "Use this grid to showcase PDF annual reports. Upload cover thumbnails in Admin → Media.",
    pdfLinks: [],
    category: "Annual Reports",
    tags: [],
    featuredImage: PH.card,
  },
  {
    url: "https://acep.africa/annual-reports/placeholder-2/",
    title: "Financial and impact summary (sample layout)",
    dateText: (new Date().getFullYear() - 1).toString(),
    excerpt: "Link each card to a publication page or external PDF as you prefer.",
    pdfLinks: [],
    category: "Annual Reports",
    tags: [],
    featuredImage: PH.card,
  },
];

export const GALLERY_LISTING_SEO: MarketingSeo = {
  title: "Photo Gallery | ACEP",
  description:
    "Photographs from ACEP field work, events, and workshops. Replace placeholder tiles with final images in the CMS.",
};

export const VIDEO_GALLERY_SEO: MarketingSeo = {
  title: "Video Gallery | ACEP",
  description:
    "Video highlights and explainers. Add embed URLs through the CMS; OilMoney TV also lives under Platforms → OilMoneyTV.",
};

export const EVENTS_SEO: MarketingSeo = {
  title: "Events | ACEP",
  description:
    "Conferences, public forums, and programme events. Sample entries below are placeholders until live listings are connected.",
};
