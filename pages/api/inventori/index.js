import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const inventori = async (req, res) => {
   const data = req.body;
   const method = req.method;
   if (method == "POST") {
      try {
         const inventori = await prisma.inventori.create({
            data: {
               ...data,
               createdId: parseInt(data.createdId),
               updatedId: parseInt(data.updatedId),
            }
         });
         res.statusCode = 200;
         res.json({
            message: "Inventori created",
            inventori,
         });
      } catch (error) {
         res.statusCode = 400;
         res.json({
            message: "Inventori not created",
            error: error.message,
         });
      }
   } else if (method == "GET") {
      try {
         const result = await prisma.inventori.findMany({
            include: {
               updatedBy: true, createdBy: true, logstok: true
            }, where: {
               isDeleted: false,
            }, orderBy: {
               id: "desc",
            }
         });
         res.status(200).json(result);
      } catch (err) {
         res.status(403).json({ err: err.message });
      }
   } else if (method == "DELETE") {
      try {
         const result = await prisma.inventori.updateMany({
            where: {
               id: { in: data.id }
            }, data: {
               isDeleted: true,
               deletedAt: new Date(),
               updatedId: 1,
            }
         })
         res.status(200).json(result);
      } catch (err) {
         res.status(403).json({ err: err.message });
      }
   }
}
export default inventori;