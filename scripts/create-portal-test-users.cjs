/* Load .env when running plain `node` (no Next/Prisma env injection). */
const fs = require("fs");
const path = require("path");
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

/**
 * Idempotent: creates one published demo event (if none exists) and three portal
 * test identities — confirmed attendee, confirmed exhibitor, and speaker — each
 * with a PortalUser and password suitable for POST /api/auth/login.
 *
 * Usage (from repo root):
 *   node scripts/create-portal-test-users.cjs
 *   PORTAL_TEST_PASSWORD='Your12+chars' node scripts/create-portal-test-users.cjs
 *
 * Default password for all three: TestPortal123!
 * Emails:
 *   portal-attendee@acep.local
 *   portal-speaker@acep.local
 *   portal-exhibitor@acep.local
 */
/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const { createHash, randomBytes, randomInt, scryptSync } = require("crypto");

const prisma = new PrismaClient();

const DEMO_SLUG = "unified-login-demo";
const PASSWORD = (process.env.PORTAL_TEST_PASSWORD && process.env.PORTAL_TEST_PASSWORD.trim()) || "TestPortal123!";

const ACCOUNTS = [
  {
    key: "attendee",
    email: "portal-attendee@acep.local",
    displayName: "Demo Attendee",
  },
  {
    key: "speaker",
    email: "portal-speaker@acep.local",
    displayName: "Demo Speaker",
  },
  {
    key: "exhibitor",
    email: "portal-exhibitor@acep.local",
    displayName: "Demo Exhibitor",
  },
];

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function hashToken(plain) {
  return createHash("sha256").update(plain).digest("hex");
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCheckInCode() {
  let s = "";
  for (let i = 0; i < 8; i += 1) {
    s += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return s;
}

async function uniqueCheckInCode(tx) {
  for (let t = 0; t < 20; t += 1) {
    const c = generateCheckInCode();
    const [a, b] = await Promise.all([
      tx.eventRegistration.findUnique({ where: { checkInCode: c } }),
      tx.eventExhibitorRegistration.findUnique({ where: { checkInCode: c } }),
    ]);
    if (!a && !b) return c;
  }
  throw new Error("Could not allocate check-in code");
}

async function getOrCreatePublishedEvent() {
  let ev = await prisma.event.findFirst({ where: { status: "PUBLISHED" } });
  if (ev) return ev;

  const starts = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const ends = new Date(starts.getTime() + 2 * 60 * 60 * 1000);
  ev = await prisma.event.create({
    data: {
      slug: DEMO_SLUG,
      title: "Unified login demo (do not delete in dev)",
      description: "Seeded for portal login tests.",
      startsAt: starts,
      endsAt: ends,
      status: "PUBLISHED",
      publicRegistration: true,
      publicExhibitorRegistration: true,
    },
  });
  console.log("Created published event:", ev.slug, ev.id);
  return ev;
}

async function upsertPortalUser(email, displayName) {
  const passwordHash = hashPassword(PASSWORD);
  return prisma.portalUser.upsert({
    where: { email },
    create: { email, displayName, passwordHash },
    update: { displayName, passwordHash },
  });
}

async function main() {
  const event = await getOrCreatePublishedEvent();
  const nextTokenHash = () => hashToken(randomBytes(32).toString("hex"));
  const invitePlain = randomBytes(32).toString("base64url");

  const attendee = ACCOUNTS.find((a) => a.key === "attendee");
  const speaker = ACCOUNTS.find((a) => a.key === "speaker");
  const exhibitor = ACCOUNTS.find((a) => a.key === "exhibitor");

  for (const acc of ACCOUNTS) {
    await upsertPortalUser(acc.email, acc.displayName);
  }

  const attendeeUser = await prisma.portalUser.findUniqueOrThrow({ where: { email: attendee.email } });
  const speakerUser = await prisma.portalUser.findUniqueOrThrow({ where: { email: speaker.email } });
  const exhibitorUser = await prisma.portalUser.findUniqueOrThrow({ where: { email: exhibitor.email } });

  const regIn = await prisma.eventRegistration.findUnique({
    where: { eventId_email: { eventId: event.id, email: attendee.email } },
  });
  if (!regIn) {
    const checkInCode = await uniqueCheckInCode(prisma);
    await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        fullName: attendee.displayName,
        email: attendee.email,
        status: "CONFIRMED",
        checkInCode,
        confirmationTokenHash: nextTokenHash(),
        confirmedAt: new Date(),
        portalUserId: attendeeUser.id,
      },
    });
    console.log("Created CONFIRMED attendee registration:", attendee.email);
  } else {
    await prisma.eventRegistration.update({
      where: { id: regIn.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: regIn.confirmedAt || new Date(),
        portalUserId: attendeeUser.id,
        fullName: attendee.displayName,
      },
    });
    console.log("Updated attendee registration:", attendee.email);
  }

  const spk = await prisma.eventSpeaker.findFirst({
    where: { eventId: event.id, email: speaker.email },
  });
  if (!spk) {
    await prisma.eventSpeaker.create({
      data: {
        eventId: event.id,
        displayName: speaker.displayName,
        email: speaker.email,
        inviteTokenHash: hashToken(invitePlain),
        portalUserId: speakerUser.id,
      },
    });
    console.log("Created speaker row:", speaker.email);
  } else {
    await prisma.eventSpeaker.update({
      where: { id: spk.id },
      data: { portalUserId: speakerUser.id, displayName: speaker.displayName },
    });
    console.log("Updated speaker row:", speaker.email);
  }

  const exh = await prisma.eventExhibitorRegistration.findUnique({
    where: { eventId_email: { eventId: event.id, email: exhibitor.email } },
  });
  if (!exh) {
    const checkInCode = await uniqueCheckInCode(prisma);
    await prisma.eventExhibitorRegistration.create({
      data: {
        eventId: event.id,
        companyName: "Demo Exhibitor Co",
        contactName: exhibitor.displayName,
        email: exhibitor.email,
        status: "CONFIRMED",
        checkInCode,
        confirmationTokenHash: nextTokenHash(),
        confirmedAt: new Date(),
        portalUserId: exhibitorUser.id,
      },
    });
    console.log("Created CONFIRMED exhibitor registration:", exhibitor.email);
  } else {
    await prisma.eventExhibitorRegistration.update({
      where: { id: exh.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: exh.confirmedAt || new Date(),
        portalUserId: exhibitorUser.id,
        contactName: exhibitor.displayName,
        companyName: "Demo Exhibitor Co",
      },
    });
    console.log("Updated exhibitor registration:", exhibitor.email);
  }

  console.log("\n--- Portal test accounts (unified /login) ---");
  console.log("Password (all three):", PASSWORD);
  for (const a of ACCOUNTS) {
    console.log(`  ${a.key.padEnd(10)} ${a.email}`);
  }
  console.log("Event:", event.slug, `(${event.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
