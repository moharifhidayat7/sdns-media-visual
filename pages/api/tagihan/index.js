import bcrypt from "bcrypt";
import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const [result, totalResult] = await prisma.$transaction([
        prisma.tagihan.findMany({
          skip,
          take: limit,
          include: {
            createdBy: true,
            updatedBy: true,
            pelanggan: true,
          },
          where: {
            isDeleted: false,
            OR: [
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
        }),
        prisma.tagihan.count({
          where: {
            isDeleted: false,
            OR: [
              {
                kode: {
                  contains: search,
                },
              },
            ],
          },
        }),
      ]);

      const pages = Math.ceil(totalResult / limit);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data tagihan",
        result: result,
        total: totalResult,
        pages,
        page,
        limit,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "POST") {
    try {
      const tagihan = await prisma.tagihan.create({
        data: {
          ...req.body,
          createdId: session.user ? session.user.id : null,
        },
      });

      res.statusCode = 200;
      res.json({
        message: "Tagihan created",
        tagihan,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const tagihan = await prisma.tagihan.updateMany({
        where: {
          id: { in: req.body.id },
        },
        data: {
          updatedId: session.user.id,
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      res.statusCode = 200;
      res.json({
        message: "Tagihan deleted",
        tagihan,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
