import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (req, res) => {
   const data = req.body;
   const method = req.method;
   const id = req.query.id;
   if (method == "PUT") {
      try {
         const result = await prisma.inventori.update({
            where: {
               id: parseInt(id)
            }, data: {
               ...data,
               updatedId: 1,
               stok: parseInt(data.stok_awal),
               stok_awal: parseInt(data.stok_awal),
               harga_beli: parseInt(data.harga_beli)
            }
         })
         res.status(200).json(result);
      } catch (err) {
         res.status(403).json({ err: err.message });
      }
   } else if (method == "GET") {
      try {
         const result = await prisma.inventori.findFirst({
            include: {
               updatedBy: true, createdBy: true, logstok: true
            }, where: {
               id: parseInt(id),
               isDeleted: false,
            }
         })
         res.status(200).json(result);
      } catch (err) {
         res.status(403).json({ err: err.message });
      }
   }else if(method=="DELETE"){
      try {
         const result = await prisma.inventori.update({
            where: {
               id: parseInt(id)
            }, data: {
               isDeleted: true,
               deletedAt: new Date(),
               updatedId: 1,
            }
         })
         await prisma.logstok.updateMany({
            where: {
               inventoriId: parseInt(id)
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