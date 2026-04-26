import { describe, expect, it } from "vitest";
import { resolveUnifiedLogin } from "./unified-login";

function verifyPlain(pw: string, stored: string) {
  return pw === stored;
}

describe("resolveUnifiedLogin", () => {
  it("returns cms when cms password matches", () => {
    const r = resolveUnifiedLogin({
      password: "ok",
      cmsUser: { id: "c1", isActive: true, passwordHash: "ok" },
      portalUser: null,
      verify: verifyPlain,
    });
    expect(r).toEqual({ target: "cms", cmsUserId: "c1" });
  });

  it("prefers cms when both passwords match", () => {
    const r = resolveUnifiedLogin({
      password: "same",
      cmsUser: { id: "c1", isActive: true, passwordHash: "same" },
      portalUser: { id: "p1", passwordHash: "same" },
      verify: verifyPlain,
    });
    expect(r).toEqual({ target: "cms", cmsUserId: "c1" });
  });

  it("returns portal when only portal matches", () => {
    const r = resolveUnifiedLogin({
      password: "ok",
      cmsUser: { id: "c1", isActive: true, passwordHash: "other" },
      portalUser: { id: "p1", passwordHash: "ok" },
      verify: verifyPlain,
    });
    expect(r).toEqual({ target: "portal", portalUserId: "p1" });
  });

  it("ignores inactive cms even if password matches", () => {
    const r = resolveUnifiedLogin({
      password: "ok",
      cmsUser: { id: "c1", isActive: false, passwordHash: "ok" },
      portalUser: { id: "p1", passwordHash: "ok" },
      verify: verifyPlain,
    });
    expect(r).toEqual({ target: "portal", portalUserId: "p1" });
  });

  it("returns null when nothing matches", () => {
    expect(
      resolveUnifiedLogin({
        password: "x",
        cmsUser: { id: "c1", isActive: true, passwordHash: "y" },
        portalUser: { id: "p1", passwordHash: "z" },
        verify: verifyPlain,
      }),
    ).toBeNull();
  });
});
