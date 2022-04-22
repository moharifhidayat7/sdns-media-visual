import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  const session = await getSession({ req });
  if (req.method == "POST") {
    try {
      const FakturStokMasukItem = await prisma.FakturStokMasukItem.createMany({
        data: [...data.map((item) => ({
          ...item,
          createdId: session.user.id || null,
          updatedId: session.user.id || null
        }))],
      });
      res.statusCode = 200;
      res.json({
        message: "Add data success",
        data: FakturStokMasukItem,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({ message: error.message });
    }
  } else if (req.method == "GET") {
    const search = req.query.search || "";
    const status = req.query.status || undefined;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const FakturStokMasukItem = await prisma.FakturStokMasukItem.findMany({
        skip,
        take: limit,
        include: {
Gudang:true
        },
        where: {
          isDeleted: false,
        }
      })
      res.json({
        status: "success",
        message: "Berhasil mengambil data FakturStokMasukItem",
        result: FakturStokMasukItem,
        // total,
        // pages,
        page,
        limit,
      });
    } catch (err) {
      res.status(403).json({
        status: "error",
        message: err.message,
        result: [],
        total: 0,
        pages: 0,
        page: 1,
        limit: 10,
      });
    }
  } else if (req.method == "DELETE") {
    try {
      const mkas = await prisma.mkas.updateMany({
        where: {
          id: { in: data.id },
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      res.statusCode = 200;
      res.json({
        message: "mkas deleted",
        mkas,
      });
    } catch (error) {
      res.status(403).json({ err: err.message });
    }
  }
};
