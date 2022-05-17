import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

//prisma create produk

const Index = async (req, res) => {
  const data = req.body;
  const session = await getSession({ req });
  if (req.method == "POST") {
    try {
      const result = await prisma.akun.create({
        data: {
          ...data,
          kode: data.kode,
          parentId: parseInt(data.parentId) || null,
          createdId: session.user.id,
          updatedId: session.user.id,
        },
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
    try {
      const result = await prisma.akun.findMany({
        include: {
          parent: true,
        },
        where: {
          isDeleted: false,
        },
        orderBy: {
          kode: "asc",
        },
      });
      const total = await prisma.akun.count({
        where: {
          isDeleted: false,
        },
      });
      res.json({
        status: "success",
        message: "Berhasil mengambil data mkas",
        result,
      });
    } catch (err) {
      res.status(403).json({
        status: "error",
        message: err.message,
        result: [],
      });
    }
  } else if (req.method == "DELETE") {
    try {
      const result = await prisma.akun.updateMany({
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
export default Index;
