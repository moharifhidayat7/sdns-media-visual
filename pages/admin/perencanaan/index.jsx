import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Layout from "@components/views/Layout";
import Head from "next/head";
import {
  Title,
  Tabs,
  Box,
  createStyles,
  Table,
  ActionIcon,
  Progress,
  Badge,
  Anchor,
  Text,
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

const Perencanaan = ({ result }) => {
  const { data: session, status } = useSession();
  const [state, dispatch] = useGlobalContext();
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);
  const { classes, theme } = useStyles();
  const notifications = useNotifications();
  const modals = useModals();

  useEffect(() => {
    dispatch({ type: "set_data", payload: result });
  }, []);

  const konfirmasi = async (id) => {
    await fetch("/api/kas/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "SUKSES" }),
    }).then((res) => {
      if (res.status === 200) {
        refreshHandler();
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Konfirmasi",
          message: "Konfirmasi kas berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Konfirmasi",
          message: "Konfirmasi Kas gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };

  const deleteHandler = async (selected) => {
    await fetch("/api/kas/" + selected, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selected }),
    }).then((res) => {
      if (res.status === 200) {
        dispatch({ type: "delete", payload: selected });
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete",
          message: "Delete data berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete",
          message: "Delete data gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };

  const suksesRows =
    state.data.result &&
    state.data.result
      .filter((e) => e.status != "PENDING")
      .map((row) => {
        return (
          <tr key={row.id}>
            <td>{dateFormat(row.createdAt, "dd/mm/yy")}</td>
            <td>{row.keterangan}</td>
            <td>{row.akun && `${row.akun.kode} - ${row.akun.nama}`}</td>
            <td>
              {row.akun && row.akun.tipe == "DEBET" ? (
                <Text color="green">DEBET</Text>
              ) : (
                <Text color="red">KREDIT</Text>
              )}
            </td>
            <td>
              {row.akun && row.akun.tipe == "DEBET" ? (
                <Text color="green">{"Rp. " + convertToRupiah(row.saldo)}</Text>
              ) : (
                <Text color="red">{"Rp. " + convertToRupiah(row.saldo)}</Text>
              )}
            </td>
            <td>
              <Badge
                variant="filled"
                color={
                  row.status == "PENDING"
                    ? "yellow"
                    : row.status == "SUKSES"
                    ? "green"
                    : "red"
                }
              >
                {row.status}
              </Badge>
            </td>
          </tr>
        );
      });

  const pendingRows =
    state.data.result &&
    state.data.result
      .filter((e) => e.status == "PENDING")
      .map((row) => {
        return (
          <tr key={row.id}>
            <td>{dateFormat(row.createdAt, "dd/mm/yy")}</td>
            <td>{row.keterangan}</td>
            <td>{row.akun && `${row.akun.kode} - ${row.akun.nama}`}</td>
            <td>
              {row.akun && row.akun.tipe == "DEBET" ? (
                <Text color="green">DEBET</Text>
              ) : (
                <Text color="red">KREDIT</Text>
              )}
            </td>
            <td>
              {row.akun && row.akun.tipe == "DEBET" ? (
                <Text color="green">{"Rp. " + convertToRupiah(row.saldo)}</Text>
              ) : (
                <Text color="red">{"Rp. " + convertToRupiah(row.saldo)}</Text>
              )}
            </td>
            <td>
              <Badge
                variant="filled"
                color={
                  row.status == "PENDING"
                    ? "yellow"
                    : row.status == "SUKSES"
                    ? "green"
                    : "red"
                }
              >
                {row.status}
              </Badge>
            </td>
            <td>
              <Group spacing="xs" noWrap className="justify-end">
                {session.user.role.akses.some(
                  (e) => e.path == "/admin/kas" && e.write == true
                ) && (
                  <Button
                    color="green"
                    compact
                    onClick={() =>
                      modals.openConfirmModal({
                        title: `Konfirmasi Perencanaan Kas`,
                        centered: true,
                        children: (
                          <Text size="sm">Konfirmasi Perencanaan Kas?</Text>
                        ),
                        labels: { confirm: "Konfirmasi", cancel: "Batalkan" },
                        confirmProps: { color: "green" },
                        onConfirm: () => {
                          konfirmasi(row.id);
                        },
                      })
                    }
                  >
                    Konfirmasi
                  </Button>
                )}

                <ActionIcon
                  color="yellow"
                  variant="filled"
                  onClick={() => {
                    router.push(`${router.asPath}/form?id=${row.id}`);
                  }}
                >
                  <Pencil size={16} />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={() =>
                    modals.openConfirmModal({
                      title: `Delete Perencanaan Kas`,
                      centered: true,
                      children: (
                        <Text size="sm">
                          Anda yakin ingin menghapus
                          {row.keterangan}? Anda harus menghubungi administrator
                          untuk memulihkan data Anda.
                        </Text>
                      ),
                      labels: { confirm: "Delete", cancel: "Batalkan" },
                      confirmProps: { color: "red" },
                      onConfirm: () => {
                        deleteHandler(row.id);
                      },
                    })
                  }
                >
                  <Trash size={16} />
                </ActionIcon>
              </Group>
            </td>
          </tr>
        );
      });

  const refreshHandler = async () => {
    const res = await fetch(`/api/kas`);
    const data = await res.json();
    dispatch({ type: "set_data", payload: { ...data } });
  };

  return (
    <Layout session={session}>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Perencanaan Kas</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Perencanaan Kas
        <Group spacing="xs" className="ml-4 inline-flex">
          <Button
            color="green"
            leftIcon={<Plus size={16} />}
            onClick={() => router.push(router.asPath + "/form")}
          >
            Tambah
          </Button>
          <ActionIcon
            size={36}
            variant="filled"
            onClick={() => {
              refreshHandler();
            }}
          >
            <Refresh />
          </ActionIcon>
        </Group>
      </Title>
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
        <Tabs>
          <Tabs.Tab
            label="Pending"
            icon={<Flag2 size={14} />}
            color="yellow"
            style={{ fontWeight: 500 }}
          >
            <ScrollArea>
              <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
                <thead>
                  <tr>
                    <th style={{ width: "5rem" }}>Tanggal</th>
                    <th>Keterangan</th>
                    <th>Akun</th>
                    <th style={{ width: "5rem" }}>Tipe</th>
                    <th style={{ width: "10rem" }}>Jumlah</th>
                    <th style={{ width: "5rem" }}>Status</th>
                    <th style={{ textAlign: "right", width: "10rem" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{pendingRows}</tbody>
              </Table>
            </ScrollArea>
          </Tabs.Tab>
          <Tabs.Tab
            label="Selesai"
            icon={<Checks size={14} />}
            color="green"
            style={{ fontWeight: 500 }}
          >
            <ScrollArea>
              <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
                <thead>
                  <tr>
                    <th style={{ width: "5rem" }}>Tanggal</th>
                    <th>Keterangan</th>
                    <th>Akun</th>
                    <th style={{ width: "5rem" }}>Tipe</th>
                    <th style={{ width: "10rem" }}>Jumlah</th>
                    <th style={{ width: "5rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>{suksesRows}</tbody>
              </Table>
            </ScrollArea>
          </Tabs.Tab>
        </Tabs>
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
  const session = await getSession(ctx);
  const res = await fetch(`${process.env.API_URL}/api/kas`, OPTION);
  const result = await res.json();

  return {
    props: {
      result,
      session,
    },
  };
};

export default Perencanaan;
