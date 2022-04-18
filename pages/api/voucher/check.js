import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const result = await prisma.voucher.findMany({
        where: {
          kode: req.body.kode,
          isDeleted: false,
          expiredAt: {
            gt: new Date(),
          },
        },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
}
