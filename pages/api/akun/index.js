import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const akun = await prisma.akun.findMany();

      res.status(200).json(akun);
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "POST") {
    try {
      const akun = await prisma.akun.create({
        data: {
          ...req.body,
        },
      });

      res.statusCode = 200;
      res.json({
        message: "Akun created",
        akun,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const akun = await prisma.akun.updateMany({
        where: {
          id: { in: req.body.id },
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      res.statusCode = 200;
      res.json({
        message: "Akun deleted",
        akun,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
