import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  const session = await getSession({ req });
  if (req.method == "POST") {
    try {
      const produk = await prisma.produk.create({
        data: {
          nama: data.nama,
          kode: data.kode,
          status: data.status,
          createdId: session.user.id,
          updatedId: session.user.id,
        },
      });
      res.statusCode = 200;
      res.json({
        message: "Produk created",
        produk,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({
        message: "Produk not created",
        error: error.message,
      });
    }
  } else if (req.method == "GET") {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const produk = await prisma.produk.findMany({
        skip,
        take: limit == 9999 ? undefined : limit,
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

      const totalProduk = await prisma.produk.count({
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
      const pages = Math.ceil(totalProduk / limit);
      res.json({
        status: "success",
        message: "Berhasil mengambil data produk",
        result: produk,
        total: totalProduk,
        pages,
        page,
        limit,
      });
    } catch (err) {
      res.status(403).json({ err: "Error occured." });
    }
  } else if (req.method == "DELETE") {
    try {
      const produk = await prisma.produk.updateMany({
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
        message: "Produk deleted",
        produk,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({
        message: "Produk not deleted",
        error: error.message,
      });
    }
  }
};
