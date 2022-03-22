import prisma from "lib/prisma";

async function main() {
  const defaultUser = await prisma.user.upsert({
    where: { email: "admin@localhost" },
    update: {},
    create: {
      email: "admin@localhost",
      name: "Admin",
      username: "admin",
      password: "$2a$10$AXy4OrgOHI1x0yT1QMlDWeexFUNVoSebNEqcYYf47P/KY25vuubCW",
    },
  });

  console.log({ defaultUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
