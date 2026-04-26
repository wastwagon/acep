import { describe, expect, it } from "vitest";
import { marketingHubCardKey, marketingHubCmsId, mergeHubCardImages } from "./marketing-cms-hub";
import { cmsHeroOverride, marketingHeroCmsKeyFromPageUrl, pickHeroWithCms } from "./marketing-cms-hero";

describe("marketingHeroCmsKeyFromPageUrl", () => {
  it("maps ACEP page URLs to mkt.hero.* keys", () => {
    expect(marketingHeroCmsKeyFromPageUrl("https://acep.africa/the-organisation/")).toBe("mkt.hero.the_organisation");
    expect(marketingHeroCmsKeyFromPageUrl("https://acep.africa/2025-afreikh-summer-school/")).toBe(
      "mkt.hero.2025_afreikh_summer_school"
    );
    expect(marketingHeroCmsKeyFromPageUrl("https://acep.africa/fec-resource-centre/")).toBe("mkt.hero.fec_resource_centre");
  });
});

describe("mergeHubCardImages", () => {
  const links = [
    { title: "A", href: "/a", description: "d", image: "/d.svg" },
    { title: "B", href: "/b", description: "d", image: "/d.svg" },
  ] as const;

  it("maps marketingHubCmsId", () => {
    expect(marketingHubCmsId("about-us")).toBe("about_us");
    expect(marketingHubCmsId("resource-centre")).toBe("resource_centre");
  });

  it("overrides images by mkt.hub id + index", () => {
    const map = { [marketingHubCardKey("about_us", 0)]: "/m/x.png" };
    const out = mergeHubCardImages(links, "about_us", map);
    expect(out[0].image).toBe("/m/x.png");
    expect(out[1].image).toBe("/d.svg");
  });
});

describe("cmsHeroOverride and pickHeroWithCms", () => {
  it("returns null when value empty or missing", () => {
    expect(cmsHeroOverride({ "mkt.hero.team": "  " }, "https://acep.africa/team/")).toBeNull();
    expect(cmsHeroOverride({}, "https://acep.africa/team/")).toBeNull();
  });

  it("picks override when set", () => {
    const map = { "mkt.hero.team": "/media/cms/x.png" };
    expect(cmsHeroOverride(map, "https://acep.africa/team/")).toBe("/media/cms/x.png");
    expect(pickHeroWithCms("/placeholders/a.svg", map, "https://acep.africa/team/")).toBe("/media/cms/x.png");
    expect(pickHeroWithCms("/placeholders/a.svg", map, "https://acep.africa/our-partners/")).toBe("/placeholders/a.svg");
  });
});
