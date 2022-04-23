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
      const result = await prisma.mkas.findFirst({
        include: {
          updatedBy: true,
          createdBy: true,
          perkiraan: true,
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
      const result = await prisma.mkas.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nama: data.nama,
          status: data.status,
          prefix: data.prefix,
          kode: data.kode,
          updatedId: session.user.id,
          perkiraan:{
            disconnect:[...data.disconnect.map(item => {
              return {
                id: item.id
              }
            })],
            upsert:[...data.perkiraan.map(item => {
              return {
                create:{
                  nama: item.nama,
                  status: item.status,
                  createdId: session.user.id,
                  updatedId: session.user.id
                },
                update:{
                  nama: item.nama,
                  status: item.status,
                  updatedId: session.user.id
                },
                where:{
                  id: item.id
                }
              }
            })]

          }
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
      const result = await prisma.mkas.update({
        where: {
          id: parseInt(id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      res.status(200).json({
        message: "paket deleted",
        result,
      });
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  }
};
