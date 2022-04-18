import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import { customAlphabet } from "nanoid";

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
        createdBy: true,
        updatedBy: true,
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
    };

    try {
      const [result, totalResult] = await prisma.$transaction([
        prisma.voucher.findMany(prismaQuery),
        prisma.voucher.count({
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
        message: "Berhasil mengambil data voucher",
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
      const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const nanoid = customAlphabet(alphabet, 12);

      const prepareData = Array.from(
        { length: parseInt(req.body.jumlah) },
        () => ({
          kode: nanoid(),
          expiredAt: req.body.expiredAt,
          perpanjangan: req.body.perpanjangan,
          createdId: session.user ? session.user.id : null,
        })
      );

      const voucher = await prisma.voucher.createMany({
        data: prepareData,
        skipDuplicates: false,
      });

      res.statusCode = 200;
      res.json({
        message: "Voucher created",
        voucher,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const voucher = await prisma.voucher.updateMany({
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
        message: "Voucher deleted",
        voucher,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
