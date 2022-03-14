import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
   const data = req.body;
   if (req.method == "POST") {
      const user = await prisma.user.create({
         data: {
            email: data.email,
            password: data.password,
            username:data.username
         }
      });
      res.json(user);
   }
   else if (req.method == "GET") {
      try {
         const result = await prisma.user.findMany();
         res.status(200).json(result);
      } catch (err) {
         console.log(err);
         res.status(403).json({ err: "Error occured." });
      }
   }


};