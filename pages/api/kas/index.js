import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  const session = await getSession({ req });
  if (req.method == "POST") {
    try {
      const result = await prisma.kas.create({
        data:{
          ...data,
          akunId:parseInt(data.akunId),
          createdId: session.user.id,
          updatedId: session.user.id
        }
      });
      res.statusCode = 200;
      res.json({
        message: "Data berhasil ditambahkan",
        result,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({ message: error.message, result: [] });
    }
  } else if (req.method == "GET") {
    const search = req.query.search || "";
    const status = req.query.status || undefined;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const result = await prisma.kas.findMany({
        skip,
        take: limit,
        include: {
          akun: true,
        },
        where: {
          isDeleted: false,
 
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const total = await prisma.kas.count({
        where: {
          isDeleted: false,

        },
      });
      const pages = Math.ceil(total / limit);
      res.json({
        status: "success",
        message: "Berhasil mengambil data",
        result,
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
      const result = await prisma.kas.updateMany({
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
        message: "Data deleted",
        result,
      });
    } catch (error) {
      res.status(403).json({ err: err.message });
    }
  }
};
