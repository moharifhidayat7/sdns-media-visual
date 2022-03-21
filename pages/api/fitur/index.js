import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//prisma create produk
export default async (req, res) => {
   const data = req.body;
   if (req.method == "POST") {
      try {
         const fitur = await prisma.fitur.create({
            data: {
               ...data,
               createdId: parseInt(data.createdId),
               updatedId: parseInt(data.updatedId),
            }
         });
         res.statusCode = 200;
         res.json({
            message: res.message,
            fitur,
         });
      } catch (error) {
         res.statusCode = 400;

         res.json({ message: error.message });
      }
   }
   else if (req.method == "GET") {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      try {
         const fitur = await prisma.fitur.findMany({
            skip,
            take: limit,
            include: {
               createdBy: true,
               updatedBy: true,
            },
            where: {
               isDeleted: false,
               OR: [
                  {
                     nama: {
                        contains: search
                     }
                  },
                  {
                     kode: {
                        contains: search
                     }
                  }
               ]
            },
            orderBy: {
               createdAt: "desc",
            },
         });
         const total = await prisma.fitur.count({
            where: {
               isDeleted: false,
               OR: [
                  {
                     nama: {
                        contains: search
                     }
                  },
                  {
                     kode: {
                        contains: search
                     }
                  }
               ]
            },

         });
         const pages = Math.ceil(total / limit);
         res.json({
            status: "success",
            message: "Berhasil mengambil data fitur",
            result: fitur,
            total,
            pages,
            page,
            limit,
         });
      } catch (err) {
         res.status(403).json({
            status: "error",
            message: err.message,
            result: [],
            total: 0,
            pages: 0,
            page: 1,
            limit: 10,
         });
      }
   }
   else if (req.method == "DELETE") {

      try {
         const fitur = await prisma.fitur.updateMany({
            where: {
               id: { in: data.id }
            },
            data: {
               isDeleted: true,
               deletedAt: new Date(),
            }
         });
         res.statusCode = 200;
         res.json({
            message: "fitur deleted",
            fitur,
         });
      } catch (error) {
         res.status(403).json({ err: err.message });
      }
   }
};