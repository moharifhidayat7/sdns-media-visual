import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  rejectOnNotFound: true,
});
export default async (req, res) => {
  const id = req.query.id;
  if (req.method == "GET") {
    try {
      const result = await prisma.kas.findFirst({
        include: {
          akun: true,
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
      let newData = data;
      if (data.akunId) {
        newData.akunId == parseInt(data.akunId);
      }
      const result = await prisma.kas.update({
        where: {
          id: parseInt(id),
        },
        data: {
          ...newData,
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
      const result = await prisma.kas.update({
        where: {
          id: parseInt(id),
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      res.status(200).json({
        message: "Data deleted",
        result,
      });
    } catch (err) {
      res.status(403).json({ err: err.message });
    }
  }
};
