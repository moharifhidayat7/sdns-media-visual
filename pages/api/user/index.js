import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await prisma.user.findMany();

      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ err: "Error occured." });
    }
  }
  if (req.method === "POST") {
    try {
      const user = await prisma.user.create({
        data: req.body,
      });
      res.statusCode = 200;
      res.json({
        message: "User created",
        user,
      });
    } catch (error) {
      res.status(403).json({ err: "Error occured." });
    }
  }
}
