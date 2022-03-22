import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

const logstok = async (req, res) => {
  const data = req.body;
  const method = req.method;
  const session = await getSession({ req });
  if (method == "POST") {
    try {
      const logstok = await prisma.logstok.create({
        data: {
          ...data,
          createdId: session.user.id,
          updatedId: session.user.id,
        },
      });
      res.statusCode = 200;
      res.json({
        message: "Logstok created",
        logstok,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({
        message: "Logstok not created",
        error: error.message,
      });
    }
  } else if (method == "GET") {
    try {
      const result = await prisma.logstok.findMany({
        include: {
          updatedBy: true,
          createdBy: true,
          inventori: true,
        },
        where: {
          isDeleted: false,
        },
        orderBy: {
          id: "desc",
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  } else if (method == "DELETE") {
    try {
      const result = await prisma.logstok.updateMany({
        where: {
          id: { in: data.id },
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
export default logstok;
