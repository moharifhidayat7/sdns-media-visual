import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const result = await prisma.role.findUnique({
        where: {
          id: req.query.id,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "PUT") {
    try {
      const role = await prisma.role.update({
        where: {
          id: req.query.id,
        },
        data: {
          ...req.body,
          updatedId: session.role ? session.role.id : null,
        },
      });

      res.status(200).json({
        message: "role updated",
        role,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const role = await prisma.role.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedId: session.role ? session.role.id : null,
        },
      });

      res.status(200).json({
        message: "role deleted",
        role,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
