import bcrypt from "bcrypt";
import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
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
      const hash = bcrypt.hash(
        password,
        saltRounds,
        async function (err, hash) {
          return hash;
        }
      );
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
