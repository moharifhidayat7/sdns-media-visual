import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await prisma.user.findUnique({
        where: {
          id: req.query.id,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ err: "Error occured." });
    }
  }
  if (req.method === "PUT") {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.query.id,
        },
        data: req.body,
      });
      res.statusCode(200).json({
        message: "User updated",
        user,
      });
    } catch (error) {
      res.status(403).json({ err: "Error occured." });
    }
  }
}
