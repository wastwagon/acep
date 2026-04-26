import type { CmsUser, PortalUser } from "@prisma/client";

export type UnifiedLoginResolution =
  | { target: "cms"; cmsUserId: string }
  | { target: "portal"; portalUserId: string }
  | null;

/**
 * Single email/password gate: active CMS users take precedence when the password
 * matches CMS; otherwise portal participants. Same password in both systems → CMS.
 */
export function resolveUnifiedLogin(args: {
  password: string;
  cmsUser: Pick<CmsUser, "id" | "isActive" | "passwordHash"> | null;
  portalUser: Pick<PortalUser, "id" | "passwordHash"> | null;
  verify: (password: string, stored: string) => boolean;
}): UnifiedLoginResolution {
  const { password, cmsUser, portalUser, verify } = args;
  const cmsOk = !!cmsUser?.isActive && verify(password, cmsUser.passwordHash);
  const portalOk = !!portalUser && verify(password, portalUser.passwordHash);

  if (cmsOk) return { target: "cms", cmsUserId: cmsUser!.id };
  if (portalOk) return { target: "portal", portalUserId: portalUser!.id };
  return null;
}
