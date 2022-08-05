import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import ExcelJS from "exceljs";
import stream from "stream";
import dateFormat, { i18n } from "dateformat";
import ArrayToTree from "array-to-tree";
import _ from "lodash";

i18n.dayNames = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

i18n.monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

i18n.timeNames = ["a", "p", "am", "pm", "A", "P", "AM", "PM"];

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const start = req.query.start;
    const end = req.query.end;
    const prismaQuery = {
      skip,
      take: limit,
      include: {
        akun: true,
      },
      where: {
        isDeleted: false,
        createdAt: {
          lte: new Date(end),
          gte: new Date(start),
        },
        OR: [
          {
            keterangan: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    };
    try {
      const [result, totalResult] = await prisma.$transaction([
        prisma.kas.findMany(prismaQuery),
        prisma.kas.count({
          where: {
            isDeleted: false,
            createdAt: {
              lte: new Date(end),
              gte: new Date(start),
            },
            OR: [
              {
                keterangan: {
                  contains: search,
                },
              },
            ],
          },
        }),
      ]);

      const pages = Math.ceil(totalResult / limit);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data kas",
        result: result,
        total: totalResult,
        pages,
        page,
        limit,
      });
    } catch (error) {
      res.status(400).json({ err: "Error occured." });
    }
  }
  if (req.method === "POST") {
    const akun = await prisma.akun.findMany({
      include: {
        parent: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        kode: "asc",
      },
    });

    const noAkun = (v, kode = "") => {
      if (v.parentId != null) {
        const newKode = v.kode + "." + kode;
        return noAkun(
          akun.filter((a) => a.id == v.parentId)[0],
          kode == "" ? v.kode : newKode
        );
      }
      return v.kode + "." + kode;
    };

    const workbook = new ExcelJS.Workbook();
    const resp = await fetch(
      new Request(process.env.API_URL + "/template-kas.xlsx")
    );
    const buff = await resp.arrayBuffer();
    const buffer = Buffer.from(buff);
    const readStream = new stream.PassThrough();
    readStream.end(buffer);

    await workbook.xlsx.read(readStream);

    const sheet = workbook.worksheets[0];
    const sheet1 = workbook.worksheets[1];

    const prismaQ = {
      include: {
        akun: true,
      },
      where: {
        isDeleted: false,
        createdAt: {
          lte: new Date(req.query.end),
          gte: new Date(req.query.start),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    };
    const data = await prisma.kas.findMany(prismaQ);
    let rowStart = 6;

    sheet.getRow(3).getCell(1).value +=
      " " +
      dateFormat(req.query.start, "dd mmmm yyyy") +
      " - " +
      dateFormat(req.query.end, "dd mmmm yyyy");
    sheet1.getRow(3).getCell(1).value +=
      " " +
      dateFormat(req.query.start, "dd mmmm yyyy") +
      " - " +
      dateFormat(req.query.end, "dd mmmm yyyy");

    for (let i = 0; i < data.length; i++) {
      const row = sheet.getRow(rowStart);
      const kas = data[i];

      row.getCell(1).value = new Date(kas.createdAt);
      row.getCell(2).value = noAkun(kas.akun);
      row.getCell(3).value = kas.keterangan;
      row.getCell(4).value =
        kas.akun.tipe == "DEBET" ? parseInt(kas.saldo) : "";
      row.getCell(5).value =
        kas.akun.tipe == "KREDIT" ? parseInt(kas.saldo) : "";
      rowStart++;
    }

    let rowStart2 = 7;
    const recAkun = (ak, level = 1, parentKode = "") => {
      const row = sheet1.getRow(rowStart2);

      if (ak.parentId == null) {
        row.getCell(1).value = ak.kode;
        row.getCell(2).value = ak.nama;

        row.font = {
          bold: true,
        };
      } else {
        row.getCell(level).value = parentKode + ak.kode;
        row.getCell(4).value = ak.nama;
        row.font = {
          bold: false,
        };
      }
      rowStart2++;

      const sumTrx = parseInt(
        _.sumBy(data, (o) => {
          if (o.akun.id == ak.id) {
            return 1;
          }
          return 0;
        })
      );

      const sumSaldo = parseInt(
        _.sumBy(data, (o) => {
          if (o.akun.id == ak.id) {
            return parseInt(o.saldo);
          }
          return 0;
        })
      );

      if (ak.parentId == null) {
        row.getCell(5).value = ak.tipe == "DEBET" ? "D" : "K";
      } else {
        row.getCell(6).value = sumTrx;
        row.getCell(7).value = sumSaldo;
      }

      row.getCell(6).font = {
        bold: true,
      };

      if (ak.children) {
        let total = 0;
        let trx = 0;
        let formula = `SUM(G${rowStart2}:G${
          rowStart2 + ak.children.length - 1
        })`;
        let formula2 = `SUM(F${rowStart2}:F${
          rowStart2 + ak.children.length - 1
        })`;
        for (let k = 0; k < ak.children.length; k++) {
          const sumSaldo = parseInt(
            _.sumBy(data, (o) => {
              if (o.akun.id == ak.children[k].id) {
                return o.saldo;
              }
              return 0;
            })
          );

          const sumTrx = parseInt(
            _.sumBy(data, (o) => {
              if (o.akun.id == ak.id) {
                return 1;
              }
              return 0;
            })
          );

          total += sumSaldo;
          trx += sumTrx;
          recAkun(ak.children[k], level + 1, parentKode + ak.kode + ".");
        }
        row.getCell(8).value = { formula: formula, result: total };
        row.getCell(6).value = { formula: formula2, result: trx };
      }
    };

    const newAkun = ArrayToTree(akun, {
      parentProperty: "parentId",
    });
    for (let j = 0; j < newAkun.length; j++) {
      recAkun(newAkun[j]);
    }
    for (let k = 5; k <= sheet.rowCount; k++) {
      for (let l = 1; l <= sheet.columnCount; l++) {
        sheet.getRow(k).getCell(l).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }
    for (let k = 6; k <= sheet1.rowCount; k++) {
      for (let l = 1; l < sheet1.columnCount; l++) {
        sheet1.getRow(k).getCell(l).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `laporan-kas.xlsx`
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }
}
