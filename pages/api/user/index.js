import { data } from "autoprefixer";
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
        prisma.user.findMany({
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
                email: {
                  contains: search,
                },
              },
              {
                username: {
                  contains: search,
                },
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.user.count({
          where: {
            isDeleted: false,
            OR: [
              {
                email: {
                  contains: search,
                },
              },
              {
                username: {
                  contains: search,
                },
              },
            ],
          },
        }),
      ]);
      const userWithoutPassword = result.map((user) => {
        const { password, resetPasswordToken, ...other } = user;
        return other;
      });

      const pages = Math.ceil(totalResult / limit);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data user",
        result: userWithoutPassword,
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
      const { password } = req.body;
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const user = await prisma.user.create({
        data: {
          ...req.body,
          password: hash,
          createdBy: session.user ? session.user.id : null,
        },
      });

      delete user.password;
      delete user.resetPasswordToken;

      res.statusCode = 200;
      res.json({
        message: "User created",
        user,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const user = await prisma.user.updateMany({
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
        message: "User deleted",
        user,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
