import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//prisma create produk
export default async (req, res) => {
   const data = req.body;
   if (req.method == "POST") {
      try {
         const produk = await prisma.produk.create({
            data: {
               nama: data.nama,
               kode: data.kode,
               createdId: parseInt(data.createdId),
               updatedId: parseInt(data.updatedId),
            }
         });
         res.statusCode = 200;
         res.json({
            message: "Produk created",
            produk,
         });
      } catch (error) {
         res.statusCode = 400;
         res.json({
            message: "Produk not created",
            error: error.message,
         });
      }
   }
   else if (req.method == "GET") {
      try {
         const result = await prisma.produk.findMany({
            include: {
               updatedBy: true, createdBy: true
            }, where: {
               isDeleted: false,
            }, orderBy: {
               id: "desc",
            }
         });
         res.status(200).json(result);
      } catch (err) {
         console.log(err);
         res.status(403).json({ err: "Error occured." });
      }
   }
}