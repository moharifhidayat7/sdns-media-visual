import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method === "GET") {
    try {
      const result = await prisma.user.findUnique({
        where: {
          id: parseInt(req.query.id),
        },
      });

      delete result.password;
      delete result.resetPasswordToken;

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "PUT") {
    try {
      const user = await prisma.user.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          ...req.body,
          roleId: parseInt(req.body.roleId),
          updatedId: session.user ? session.user.id : null,
        },
      });

      delete user.password;
      delete user.resetPasswordToken;

      res.status(200).json({
        message: "User updated",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "DELETE") {
    try {
      const user = await prisma.user.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedId: session.user ? session.user.id : null,
        },
      });

      delete user.password;
      delete user.resetPasswordToken;

      res.status(200).json({
        message: "User deleted",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ err: "Error occured." });
    }
  }
}
