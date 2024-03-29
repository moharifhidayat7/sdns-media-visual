import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const result = await prisma.role.findUnique({
        where: {
          id: parseInt(req.query.id),
        },
        include: {
          akses: true,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "PUT") {
    try {
      const updatedRole = async (
        id,
        body,
        user = session.user ? session.user.id : null
      ) => {
        return await prisma.$transaction(
          async (prisma) => {
            for (let i = 0; i < body.akses.length; i++) {
              const el = body.akses[i];
              await prisma.akses.upsert({
                where: {
                  uniqueRole: {
                    path: el.path,
                    roleId: el.roleId,
                  },
                },
                create: el,
                update: {
                  read: el.read,
                  write: el.write,
                },
              });
            }
            const role = await prisma.role.update({
              where: {
                id: parseInt(id),
              },
              data: {
                nama: body.nama,
                updatedId: user,
              },
            });
            return role;
          },
          { maxWait: 5000, timeout: 10000 }
        );
      };

      const role = await updatedRole(req.query.id, req.body);

      res.status(200).json({
        message: "role updated",
        role,
      });
    } catch (error) {
      console.log(error);
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
