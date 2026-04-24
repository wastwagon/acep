/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const defaults = [
    { key: "site.name", value: "ACEP Platform" },
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
