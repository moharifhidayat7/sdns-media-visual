import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async (req, res) => {
  const data = req.body;
  const method = req.method;
  const id = req.query.id;
  const session = await getSession({ req });
  if (method == "PUT") {
    try {
      const result = await prisma.inventori.update({
        where: {
          id: parseInt(id),
        },
        data: {
          ...data,
          updatedId: session.user.id,
          createdId: session.user.id,
          harga_beli: parseInt(data.harga_beli),
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  } else if (method == "GET") {
    try {
      const result = await prisma.inventori.findFirst({
        include: {
          updatedBy: true,
          createdBy: true,
          logstok: true,
        },
        where: {
          id: parseInt(id),
          isDeleted: false,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  } else if (method == "DELETE") {
    try {
      const result = await prisma.inventori.update({
        where: {
          id: parseInt(id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedId: session.user.id,
        },
      });
      await prisma.logstok.updateMany({
        where: {
          inventoriId: parseInt(id),
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
