/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.acep.africa";

  const defaults = [
    { key: "site.name", value: "ACEP Africa" },
    { key: "site.url", value: siteUrl },
    { key: "deployment.seeded", value: new Date().toISOString() },
    { key: "platform.version", value: "1" },
  ];

  for (const row of defaults) {
    await prisma.appSetting.upsert({
      where: { key: row.key },
      create: { key: row.key, value: row.value },
      update: { value: row.value },
    });
  }

  const adminEmail = process.env.CMS_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.CMS_ADMIN_PASSWORD?.trim();
  const adminName = process.env.CMS_ADMIN_NAME?.trim() || "ACEP Africa Administrator";

  if (adminEmail && adminPassword) {
    await prisma.cmsUser.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: adminName,
        role: "ADMIN",
        passwordHash: hashPassword(adminPassword),
        isActive: true,
      },
      update: {
        name: adminName,
        role: "ADMIN",
        passwordHash: hashPassword(adminPassword),
        isActive: true,
      },
    });
  } else {
    console.warn("CMS admin bootstrap skipped: set CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD to create admin user.");
  }

  const contentBlocks = [
    {
      key: "branding.org_name_short",
      label: "Organisation name (short)",
      groupKey: "branding",
      description: "Short name for tight layouts (e.g. header, meta).",
      value: "ACEP",
      valueType: "text",
      sortOrder: 0,
    },
    {
      key: "footer.support_line",
      label: "Footer support or contact line",
      groupKey: "footer",
      value: "",
      valueType: "text",
      sortOrder: 0,
    },
    {
      key: "home.placeholder_note",
      label: "Home page CMS note (internal)",
      groupKey: "home",
      description: "Remind editors which areas are still static vs CMS-driven.",
      value: "Main marketing pages are still part of the Next.js site. CMS posts appear under Publications and the news feed.",
      valueType: "text",
      sortOrder: 0,
    },
  ];

  const marketingHeros = [
    ["mkt.hero.the_organisation", "Hero image — The Organisation", "/the-organisation/"],
    ["mkt.hero.governing_board", "Hero image — Governing Board", "/governing-board/"],
    ["mkt.hero.team", "Hero image — Our Team", "/team/"],
    ["mkt.hero.our_partners", "Hero image — Our Partners", "/our-partners/"],
    ["mkt.hero.nextgen10", "Hero image — NextGen", "/nextgen10/"],
    ["mkt.hero.climate_academy", "Hero image — Africa Climate Academy", "/climate-academy/"],
    ["mkt.hero.2025_afreikh_summer_school", "Hero image — AFREIKH Summer School", "/2025-afreikh-summer-school/"],
    ["mkt.hero.rgchub", "Hero image — Resource Governance Campus Hub", "/rgchub/"],
    ["mkt.hero.eiccg_fund", "Hero image — EICCG Fund", "/eiccg-fund/"],
    ["mkt.hero.fec_2025", "Hero image — FEC 2025 hub", "/fec-2025/"],
    ["mkt.hero.future_of_energy_conference", "Hero image — Future of Energy Conference", "/future-of-energy-conference/"],
    ["mkt.hero.fec_brochure", "Hero image — FEC Brochure", "/fec-brochure/"],
    ["mkt.hero.fec_resource_centre", "Hero image — FEC Resource Centre", "/fec-resource-centre/"],
  ];

  for (const c of contentBlocks) {
    await prisma.cmsContentEntry.upsert({
      where: { key: c.key },
      create: c,
      update: {
        label: c.label,
        groupKey: c.groupKey,
        description: c.description,
        valueType: c.valueType,
        sortOrder: c.sortOrder,
      },
    });
  }

  for (let index = 0; index < marketingHeros.length; index++) {
    const row = marketingHeros[index];
    const [key, label, path] = row;
    const c = {
      key,
      label,
      groupKey: "marketing",
      description: `Optional. Public path to the hero image for ${path} (e.g. /media/cms/... from Media library). Empty = placeholder or snapshot.`,
      value: "",
      valueType: "url",
      sortOrder: index,
    };
    await prisma.cmsContentEntry.upsert({
      where: { key: c.key },
      create: c,
      update: {
        label: c.label,
        groupKey: c.groupKey,
        description: c.description,
        valueType: c.valueType,
        sortOrder: c.sortOrder,
      },
    });
  }

  const hubThumbConfigs = [
    { id: "about_us", n: 4, page: "About" },
    { id: "programs", n: 8, page: "Programs" },
    { id: "resource_centre", n: 7, page: "Resource centre" },
  ];
  const hubIndexBase = 20;
  for (const cfg of hubThumbConfigs) {
    for (let i = 0; i < cfg.n; i++) {
      const key = `mkt.hub.${cfg.id}.${i}`;
      const label = `Hub card image — ${cfg.page} (slot ${i + 1} of ${cfg.n})`;
      const c = {
        key,
        label,
        groupKey: "marketing",
        description: "Optional. Thumbnail for the grid on this hub page, same order as the site (0 = first card). Use Pick from media or paste a path.",
        value: "",
        valueType: "url",
        sortOrder: hubIndexBase + (cfg.id === "about_us" ? 0 : cfg.id === "programs" ? 10 : 20) + i,
      };
      await prisma.cmsContentEntry.upsert({
        where: { key: c.key },
        create: c,
        update: {
          label: c.label,
          groupKey: c.groupKey,
          description: c.description,
          valueType: c.valueType,
          sortOrder: c.sortOrder,
        },
      });
    }
  }

  const marketingPageSlugs = [
    "the-organisation",
    "governing-board",
    "team",
    "our-partners",
    "nextgen10",
    "climate-academy",
    "2025-afreikh-summer-school",
    "rgchub",
    "eiccg-fund",
    "fec-2025",
    "future-of-energy-conference",
  ];
  await prisma.cmsMarketingPage.createMany({
    data: marketingPageSlugs.map((slug) => ({ slug })),
    skipDuplicates: true,
  });

  const marketingHubSlugs = ["about-us", "programs", "resource-centre"];
  await prisma.cmsMarketingHub.createMany({
    data: marketingHubSlugs.map((slug) => ({ slug })),
    skipDuplicates: true,
  });

  const start = new Date();
  start.setDate(start.getDate() + 14);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setHours(17, 0, 0, 0);
  await prisma.event.upsert({
    where: { slug: "acep-event-sample" },
    create: {
      slug: "acep-event-sample",
      title: "ACEP event (sample) — change in /admin/events",
      description:
        "Sample event: publish it, then test /e/acep-event-sample (attendees), /e/acep-event-sample/exhibitors/register (exhibitors), and speaker invites from the admin event page. Email confirm + check-in; optional stream URL in admin.",
      location: "TBA",
      startsAt: start,
      endsAt: end,
      status: "DRAFT",
      publicRegistration: true,
      publicExhibitorRegistration: true,
      maxExhibitorRegistrations: null,
      streamUrl: null,
    },
    update: {
      title: "ACEP event (sample) — change in /admin/events",
      publicExhibitorRegistration: true,
    },
  });

  const existingAuthor = await prisma.cmsUser.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  const backfill = await prisma.eventContribution.updateMany({
    where: { status: "SUBMITTED", moderationStatus: "NONE" },
    data: { moderationStatus: "PENDING" },
  });
  if (backfill.count > 0) {
    console.log(`Set moderation to PENDING for ${backfill.count} submitted organiser material(s) (previously unmoderated).`);
  }

  if (existingAuthor) {
    await prisma.cmsPost.upsert({
      where: { slug: "welcome-to-acep-cms" },
      create: {
        title: "Welcome to ACEP CMS",
        slug: "welcome-to-acep-cms",
        excerpt: "Initial draft post created by seed script.",
        content: "This is a seeded draft post. Edit or publish it from /admin/posts.",
        status: "DRAFT",
        authorId: existingAuthor.id,
      },
      update: {},
    });
  }
}

main()
  .then(() => {
    console.log("Seed completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
