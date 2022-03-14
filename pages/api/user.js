import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (req, res) => {
   const data = req.body;
   if (req.method == "POST") {
      try {
         const user = await prisma.user.create({
            data: {
               ...data,
            },
         });
         res.statusCode = 200;
         res.json({
            message: "User created",
            user,
         });
      } catch (error) {
         res.statusCode = 400;
         res.json({
            message: "User not created",
            error: error.message,
         });
      }
   }
   else if (req.method == "GET") {
      try {
         const result = await prisma.user.findMany({
            include: {
               createdProduk: true,
               updatedProduk: true
            }, where: {
               isDeleted: false,
            },
         });
         res.status(200).json(result);
      } catch (err) {
         console.log(err);
         res.status(403).json({ err: "Error occured." });
      }
   }


};