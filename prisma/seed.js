const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const administrator = await prisma.role.upsert({
    where: { nama: "ADMINISTRATOR" },
    update: {},
    create: {
      nama: "ADMINISTRATOR",
      user: {
        create: [
          {
            nama: "Default User",
            email: "admin@localhost",
            password:
              "$2a$10$AXy4OrgOHI1x0yT1QMlDWeexFUNVoSebNEqcYYf47P/KY25vuubCW",
          },
        ],
      },
      akses: {
        create: [
          {
            nama: "Role",
            path: "/admin/role",
            read: true,
            write: true,
          },
          {
            nama: "Pegawai",
            path: "/admin/pegawai",
            read: true,
            write: true,
          },
        ],
      },
    },
  });

  console.log({ administrator });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
