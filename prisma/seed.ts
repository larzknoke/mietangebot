import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const mietData = [
  {
    strasse: "Lindenallee",
    hausnummer: "19",
    ort: "Holzminden",
    plz: "37603",
    groesse: 50,
    baujahr: 2023,
    nettokalt: 500,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of mietData) {
    const miet = await prisma.miet.create({
      data: u,
    });
    console.log(`Created miet with id: ${miet.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
