const prisma = require("../../lib/prisma");

module.exports = async () => {
  const akun = await prisma.akun.upsert({
    where: { id: 999 },
    update: {},
    create: {
      id: 999,
      nama: "ROOT",
      kode: "ROOT",
      tipe: "DEBET",
    },
  });
  await prisma.$queryRaw`ALTER TABLE Akun AUTO_INCREMENT=0`;

  return akun;
};
