/**
 * Verifies passwords in the DB for portal test users (npm run db:portal-test-users)
 * and optional CMS admin (CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD in .env).
 * No HTTP server required.
 *
 *   node scripts/verify-unified-login.cjs
 */
const fs = require("fs");
const path = require("path");
const { scryptSync, timingSafeEqual } = require("crypto");
const { PrismaClient } = require("@prisma/client");

const envFile = path.join(__dirname, "..", ".env");
if (fs.existsSync(envFile)) {
  const txt = fs.readFileSync(envFile, "utf8");
  for (const line of txt.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

function verifyPassword(password, stored) {
  const parts = stored.split("$");
  const algo = parts[0];
  const salt = parts[1];
  const hash = parts[2];
  if (algo !== "scrypt" || !salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  if (derived.length !== original.length) return false;
  return timingSafeEqual(derived, original);
}

const PORTAL_TEST_PASSWORD =
  (process.env.PORTAL_TEST_PASSWORD && process.env.PORTAL_TEST_PASSWORD.trim()) || "TestPortal123!";

const PORTAL_EMAILS = [
  "portal-attendee@acep.local",
  "portal-speaker@acep.local",
  "portal-exhibitor@acep.local",
];

async function main() {
  const prisma = new PrismaClient();
  try {
    let failed = false;
    for (const email of PORTAL_EMAILS) {
      const u = await prisma.portalUser.findUnique({ where: { email } });
      if (!u) {
        console.log("FAIL", email, "(no PortalUser — run npm run db:portal-test-users)");
        failed = true;
        continue;
      }
      const ok = verifyPassword(PORTAL_TEST_PASSWORD, u.passwordHash);
      console.log(ok ? "OK  " : "FAIL", email, ok ? "password matches" : "password mismatch");
      if (!ok) failed = true;
    }

    const adminEmail = process.env.CMS_ADMIN_EMAIL && process.env.CMS_ADMIN_EMAIL.trim().toLowerCase();
    const adminPw = process.env.CMS_ADMIN_PASSWORD && process.env.CMS_ADMIN_PASSWORD.trim();
    if (adminEmail && adminPw) {
      const cms = await prisma.cmsUser.findUnique({ where: { email: adminEmail } });
      if (!cms) {
        console.log("FAIL CMS", adminEmail, "(no CmsUser — run npm run db:seed)");
        failed = true;
      } else {
        const ok = verifyPassword(adminPw, cms.passwordHash);
        console.log(ok ? "OK  " : "FAIL", adminEmail, ok ? "CMS password matches" : "CMS password mismatch");
        if (!ok) failed = true;
      }
    } else {
      console.log("SKIP CMS (set CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD in .env to verify admin)");
    }

    process.exit(failed ? 1 : 0);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
