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
      const result = await prisma.fitur.findFirst({
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
      res.status(403).json({ err: err.message });
    }
  } else if (req.method == "PUT") {
    try {
      const data = req.body;
      const result = await prisma.fitur.update({
        where: {
          id: parseInt(id),
        },
        data: {
          ...data,
          updatedId: session.user.id,
        },
      });
      res.status(200).json({
        message: "Put data success",
        result,
      });
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: err.message });
    }
  } else if (req.method == "DELETE") {
    try {
      const result = await prisma.fitur.update({
        where: {
          id: parseInt(id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      res.status(200).json({
        message: "fitur deleted",
        result,
      });
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: err.message });
    }
  }
};
