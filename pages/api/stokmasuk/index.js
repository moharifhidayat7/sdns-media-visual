import prisma from "lib/prisma";

//prisma create produk
export default async (req, res) => {
  const data = req.body;
  if (req.method == "POST") {
    try {
      const FakturStokMasuk = await prisma.FakturStokMasuk.create({
        data: {
          ...data,
        },
      });
      res.statusCode = 200;
      res.json({
        message: "Add data success",
        FakturStokMasuk,
      });
    } catch (error) {
      res.statusCode = 400;
      res.json({ message: error.message });
    }
  } else if (req.method == "GET") {
    const search = req.query.search || "";
    const status = req.query.status || undefined;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const FakturStokMasuk = await prisma.FakturStokMasuk.findMany({
        skip,
        take: limit,
        include: {
          createdBy: true,
          updatedBy: true,
          supplier:true
        },
        where: {
          isDeleted: false,
          OR: [
            {
              nomortransaksi: {
                contains: search,
              },
            },
            
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const total = await prisma.FakturStokMasuk.count({
        where: {
          isDeleted: false,
          OR: [
            {
              nomortransaksi: {
                contains: search,
              },
            },
            
          ],
        },
      });
      const pages = Math.ceil(total / limit);
      res.json({
        status: "success",
        message: "Berhasil mengambil data FakturStokMasuk",
        result: FakturStokMasuk,
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
  } else if (req.method == "DELETE") {
    try {
      const mkas = await prisma.mkas.updateMany({
        where: {
          id: { in: data.id },
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      res.statusCode = 200;
      res.json({
        message: "mkas deleted",
        mkas,
      });
    } catch (error) {
      res.status(403).json({ err: err.message });
    }
  }
};
