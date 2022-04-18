const prisma = require("../lib/prisma");

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
              "$2a$10$Wml07l.ttismE1UOeOMvcuUW.w.K2tFVOVAbNpyWe3u8CgyT7hMzy", // 12345678
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
