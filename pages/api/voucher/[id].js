import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const result = await prisma.voucher.findUnique({
        where: {
          id: parseInt(req.query.id),
        },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "PUT") {
    try {
      const voucher = await prisma.voucher.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          ...req.body,
          updatedId: session.user.id,
        },
      });

      res.status(200).json({
        message: "voucher updated",
        voucher,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const voucher = await prisma.voucher.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedId: session.voucher ? session.voucher.id : null,
        },
      });

      res.status(200).json({
        message: "voucher deleted",
        voucher,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
