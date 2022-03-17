import bcrypt from "bcrypt";
import prisma from "lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (req.method === "GET") {
    const token = await getToken({ req, secret });
    try {
      const result = await prisma.user.findMany();
      const userWithoutPassword = result.map((user) => {
        const { password, resetPasswordToken, ...other } = user;
        return other;
      });
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(403).json({ err: "Error occured." });
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
      res.status(403).json({ err: "Error occured." });
    }
  }
}
