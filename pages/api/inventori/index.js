import prisma from "lib/prisma";
import dateFormat from "dateformat";
import { getSession } from "next-auth/react";

const inventori = async (req, res) => {
  const data = req.body;
  const method = req.method;
  const session = await getSession({ req });
  if (method == "POST") {
    try {
      const inventori = await prisma.inventori.create({
        data: {
          ...data,
          harga_beli: parseInt(data.harga_beli),
          stok: parseInt(data.stok ? data.stok : 0),
          createdId: session.user.id,
          updatedId: session.user.id,
        },
      });

      res.statusCode = 200;
      res.json({
        message: "Inventori created",
        inventori,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({
        message: "Inventori not created",
        error: error.message,
      });
    }
  } else if (method == "GET") {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const inventori = await prisma.inventori.findMany({
        skip,
        take: limit,
        include: {
          createdBy: true,
          updatedBy: true,
          logstok: true,
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
      const totalInventori = await prisma.inventori.count({
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
      const pages = Math.ceil(totalInventori / limit);
      res.json({
        status: "success",
        message: "Berhasil mengambil data inventori",
        result: inventori,
        pages,
        total: totalInventori,
        page,
        limit,
      });
    } catch (err) {
      res.status(403).json({ err: "Error occured." });
    }
  } else if (method == "DELETE") {
    try {
      const result = await prisma.inventori.updateMany({
        where: {
          id: { in: data.id },
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedId: session.user.id,
        },
      });

      await prisma.logstok.updateMany({
        where: {
          inventoriId: { in: data.id },
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedId: session.user.id,
        },
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  }
};
export default inventori;
