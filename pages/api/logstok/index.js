import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const logstok = async (req, res) => {
   const data = req.body;
   const method = req.method;
   if (method == "POST") {
      try {
         const logstok = await prisma.logstok.create({
            data: {
               ...data,
               createdId: parseInt(data.createdId),
               updatedId: parseInt(data.updatedId),
            }
         });
         res.statusCode = 200;
         res.json({
            message: "Logstok created",
            logstok,
         });
      } catch (error) {
         res.statusCode = 400;
         res.json({
            message: "Logstok not created",
            error: error.message,
         });
      }
   } else if (method == "GET") {
      try {
         const result = await prisma.logstok.findMany({
            include: {
               updatedBy: true, createdBy: true, inventori: true
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
         const result = await prisma.logstok.updateMany({
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
export default logstok;