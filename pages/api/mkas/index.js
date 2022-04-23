import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  const session = await getSession({ req });
  if (req.method == "POST") {
    try {
      const mkas = await prisma.mkas.create({
        include: {
          perkiraan: true
        },
        data: {
          nama: data.nama,
          status: data.status || "INACTIVE",
          prefix: data.prefix,
          kode: data.kode,
          createdId: session.user.id,
          updatedId: session.user.id,
          perkiraan: {
            create: [...data.perkiraan.map(item => {
              return {
                nama: item.nama,
                status: item.status,
                createdId: session.user.id,
                updatedId: session.user.id
              }
            })]
          }
        },
      });
      res.statusCode = 200;
      res.json({
        message: "Add data success",
        mkas,
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
      const mkas = await prisma.mkas.findMany({
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
      const total = await prisma.mkas.count({
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
      const pages = Math.ceil(total / limit);
      res.json({
        status: "success",
        message: "Berhasil mengambil data mkas",
        result: mkas,
        total,
        pages,
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
