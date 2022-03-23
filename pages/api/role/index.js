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
        prisma.role.findMany({
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
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.role.count({
          where: {
            isDeleted: false,
            OR: [
              {
                nama: {
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
        message: "Berhasil mengambil data role",
        result: result,
        total: totalResult,
        pages,
        page,
        limit,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "POST") {
    try {
      const role = await prisma.role.create({
        data: {
          ...req.body,
          createdId: session.role ? session.role.id : null,
        },
      });

      res.statusCode = 200;
      res.json({
        message: "role created",
        role,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const role = await prisma.role.updateMany({
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
        message: "role deleted",
        role,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
