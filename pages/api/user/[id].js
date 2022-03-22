import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const result = await prisma.user.findUnique({
        where: {
          id: req.query.id,
        },
      });

      delete result.password;
      delete result.resetPasswordToken;

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
        data: {
          ...req.body,
          updatedBy: session.user ? session.user.id : null,
        },
      });

      delete user.password;
      delete user.resetPasswordToken;

      res.statusCode(200).json({
        message: "User updated",
        user,
      });
    } catch (error) {
      res.status(403).json({ err: "Error occured." });
    }
  }
}
