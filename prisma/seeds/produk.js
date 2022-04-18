const prisma = require("../lib/prisma");
const { faker } = require("@faker-js/faker");

module.exports = async () => {
  const prepareData = Array.from({ length: 50 }, () => ({
    i: "a",
  }));

  //   await prisma.produk.create({
  //       data:
  //   });
};
