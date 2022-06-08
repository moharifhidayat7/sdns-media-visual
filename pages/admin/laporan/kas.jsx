import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Layout from "@components/views/Layout";
import Head from "next/head";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import "dayjs/locale/id";

import {
  Title,
  Tabs,
  InputWrapper,
  Box,
  createStyles,
  Table,
  ActionIcon,
  Progress,
  Badge,
  Anchor,
  Text,
  Pagination,
  Group,
  Button,
  ScrollArea,
} from "@mantine/core";
import {
  Flag2,
  Checks,
  Pencil,
  Trash,
  Check,
  FileDownload,
  X,
  Plus,
  Refresh,
} from "tabler-icons-react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import dateFormat from "dateformat";
import { convertToRupiah } from "helpers/functions";
import { useRouter } from "next/router";
import { useNotifications } from "@mantine/notifications";
import { useModals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  tipe: {},
}));

const LaporanKas = ({ akun }) => {
  const { data: session, status } = useSession();
  const [state, dispatch] = useGlobalContext();
  const router = useRouter();
  const [refresh] = useState(false);
  const { classes, theme } = useStyles();
  const notifications = useNotifications();
  const modals = useModals();
  const [st, setSt] = useState(null);
  const [en, setEn] = useState(null);

  const form = useForm({
    initialValues: {
      start: "",
      end: "",
    },

    validate: (values) => ({
      start: values.start != "" ? null : "Pilih Tanggal",
      end: values.end > values.start ? null : "Pilih Tanggal",
    }),
  });

  const onSubmit = async (values) => {
    const startDate = dateFormat(values.start, "mm/dd/yyyy");
    const endDate = dateFormat(values.end, "mm/dd/yyyy");

    const result = await fetch(
      `/api/laporan/kas?start=${startDate}&end=${endDate}`
    ).then((res) => res.json());
    dispatch({ type: "set_data", payload: result });
    setEn(endDate);
    setSt(startDate);
  };

  const pageChange = async (page) => {
    const startDate = dateFormat(form.values.start, "mm/dd/yyyy");
    const endDate = dateFormat(form.values.end, "mm/dd/yyyy");

    const result = await fetch(
      `/api/laporan/kas?start=${startDate}&end=${endDate}&page=${page}`
    ).then((res) => res.json());
    dispatch({ type: "set_data", payload: result });
    setEn(endDate);
    setSt(startDate);
  };

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

  const downloadFile = async (e) => {
    await fetch(`/api/laporan/kas?start=${st}&end=${en}`, {
      method: "POST",
    })
      .then((res) => res.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = `laporan-kas-${dateFormat(new Date(), "dd/mm/yyyy")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <Layout session={session}>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Laporan Kas</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Laporan Kas
      </Title>
      <Box
        sx={(theme) => ({
          border: "1px solid",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Group>
            <DatePicker
              placeholder="Mulai Tanggal"
              label="Mulai Tanggal"
              required
              {...form.getInputProps("start")}
            />
            <DatePicker
              placeholder="Sampai Tanggal"
              label="Sampai Tanggal"
              required
              excludeDate={(date) => date < form.values.start}
              {...form.getInputProps("end")}
            />
            <Button style={{ alignSelf: "flex-end" }} type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Box>
      <Box
        sx={(theme) => ({
          border: "1px solid",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        <Group direction="column" spacing="sm">
          <Title order={4}>Data Kas</Title>
          {state.data.result && (
            <>
              <Text className="inline-block" size={400}>
                Periode {dateFormat(st, "dd/mm/yyyy")} -{" "}
                {dateFormat(en, "dd/mm/yyyy")}
              </Text>
              <Button
                leftIcon={<FileDownload size={20} />}
                onClick={downloadFile}
              >
                Download Laporan (.xls)
              </Button>
            </>
          )}
        </Group>
        <Table sx={{ minWidth: 800, marginTop: "20px" }} verticalSpacing="xs">
          <thead>
            <tr>
              <th style={{ width: "8rem" }}>Tanggal</th>
              <th style={{ width: "8rem" }}>No. Akun</th>
              <th>Keterangan</th>
              <th style={{ width: "15rem" }}>Debet</th>
              <th style={{ width: "15rem" }}>Kredit</th>
            </tr>
          </thead>
          <tbody>
            {state.data.result &&
              state.data.result.map((row) => {
                return (
                  <tr key={row.id}>
                    <td>{dateFormat(row.createdAt, "dd/mm/yy")}</td>
                    <td>{noAkun(row.akun)}</td>
                    <td>{row.keterangan}</td>
                    <td>
                      {row.akun.tipe == "DEBET" && convertToRupiah(row.saldo)}
                    </td>
                    <td>
                      {row.akun.tipe == "KREDIT" && convertToRupiah(row.saldo)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <Group position="right" className="mt-4">
          <Text>
            Total : <b> {state.data.total}</b> items
          </Text>
          <Pagination
            total={state.data.pages}
            page={state.data.page}
            onChange={pageChange}
          />
        </Group>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const OPTION = {
    headers: {
      Cookie: ctx.req.headers.cookie,
    },
  };

  const akun = await fetch(`${process.env.API_URL}/api/akun`, OPTION).then(
    (res) => res.json()
  );
  const session = await getSession(ctx);

  return {
    props: {
      session,
      akun: akun.result,
    },
  };
};

export default LaporanKas;
