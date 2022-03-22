import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient({
  rejectOnNotFound: true,
});
export default async (req, res) => {
  const id = req.query.id;
  const session = await getSession({ req });
  if (req.method == "GET") {
    try {
      const result = await prisma.produk.findFirst({
        include: {
          updatedBy: true,
          createdBy: true,
        },
        where: {
          id: parseInt(id),
          isDeleted: false,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: err.message });
    }
  } else if (req.method == "PUT") {
    try {
      const data = req.body;
      const result = await prisma.produk.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nama: data.nama,
          status: data.status,
          updatedId: session.user.id,
        },
      });
      res.status(200).json({
        message: "Produk updated",
        result,
      });
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: err.message });
    }
  } else if (req.method == "DELETE") {
    try {
      const result = await prisma.produk.update({
        where: {
          id: parseInt(id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      res.status(200).json({
        message: "Produk deleted",
        result,
      });
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: err.message });
    }
  }
};
