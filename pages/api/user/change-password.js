import bcrypt from "bcrypt";
import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method == "POST") {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    const match = await bcrypt.compare(req.body.currentPassword, user.password);

    try {
      if (user && match) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(req.body.newPassword, saltRounds);
        const updatedUser = await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            password: hash,
            updatedId: session.user ? session.user.id : null,
          },
        });

        delete updatedUser.password;
        delete updatedUser.resetPasswordToken;

        res.statusCode = 200;
        res.json({
          message: "Password Changed",
          user: updatedUser,
        });
      }

      if (!user) {
        res.status(400).json({ err: "User tidak ditemukan." });
      }

      if (!match) {
        res.status(400).json({ err: "Password lama tidak sesuai." });
      }
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
