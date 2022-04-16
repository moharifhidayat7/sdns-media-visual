import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const prismaQuery = {
      skip,
      take: limit,
      include: {
        akses: true,
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
        createdAt: "asc",
      },
    };

    if (req.query.limit == 0) {
      delete prismaQuery.take;
      delete prismaQuery.skip;
    }

    try {
      const [result, totalResult] = await prisma.$transaction([
        prisma.role.findMany(prismaQuery),
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
          nama: req.body.nama,
          createdId: session.role ? session.role.id : null,
          akses: {
            create: req.body.akses,
          },
        },
      });

      res.statusCode = 200;
      res.json({
        message: "Role created",
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
        message: "Role deleted",
        role,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
