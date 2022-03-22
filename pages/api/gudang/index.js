import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  const session = await getSession({ req });
  if (req.method == "POST") {
    try {
      const gudang = await prisma.gudang.create({
        data: {
          ...data,
          createdId: session.user.id,
          updatedId: session.user.id,
        },
      });
      res.statusCode = 200;
      res.json({
        message: res.message,
        gudang,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({ error: error.message });
    }
  } else if (req.method == "GET") {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const gudang = await prisma.gudang.findMany({
        skip,
        take: limit,
        include: {
          createdBy: true,
          updatedBy: true,
        },
        where: {
          isDeleted: false,
          OR: [
            {
              nama: {
                contains: search,
              },
            },
            {
              kode: {
                contains: search,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const totalgudang = await prisma.gudang.count({
        where: {
          isDeleted: false,
          OR: [
            {
              nama: {
                contains: search,
              },
            },
            {
              kode: {
                contains: search,
              },
            },
          ],
        },
      });
      const pages = Math.ceil(totalgudang / limit);
      res.json({
        status: "success",
        message: "Berhasil mengambil data gudang",
        result: gudang,
        total: totalgudang,
        pages,
        page,
        limit,
      });
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  } else if (req.method == "DELETE") {
    try {
      const gudang = await prisma.gudang.updateMany({
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
        message: "gudang deleted",
        gudang,
      });
    } catch (error) {
      res.status(403).json({ err: err.message });
    }
  }
};
