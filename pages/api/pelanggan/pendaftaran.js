import prisma from "lib/prisma";
import { generateCode } from "helpers/functions";
import dateFormat from "dateformat";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  const kodeDate = dateFormat(new Date(), "ddmmyy");
  const code = generateCode(`CUST${kodeDate}`, 0, 1);
  const lastUser = await prisma.pelanggan.findMany({
    orderBy: {
      id: "desc",
    },
    take: 1,
  });
  try {
    const result = await prisma.pelanggan.create({
      data: {
        ...data,
        no_pelanggan: code,
        createdId: null,
        updatedId: null,
      },
    });
    await prisma.notifikasi.create({
      data: {
        title: "Pelanggan Baru",
        body: `Pelanggan Baru ${result.nama}`,
      },
    });

    res.statusCode = 200;
    res.json({
      message: "Data berhasil ditambahkan",
      result,
    });
  } catch (error) {
    res.statusCode = 400;
    res.json({ message: error.message, result: [], status: 400 });
  }
};
