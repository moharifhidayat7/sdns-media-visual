import Head from "next/head";
import _ from "lodash";
import Layout from "@components/views/Layout";

import DataTable from "@components/Table/DataTable";
import { AkunTable } from "@components/Table/AkunTable";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";

import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  ActionIcon,
  Group,
  Title,
  Button,
} from "@mantine/core";
import { Pencil, Trash } from "tabler-icons-react";
const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
  rows: {
    td: {
      borderLeft: "none",
      borderRight: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const TablePerkiraan = ({ akun, perkiraan }) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = akun.map((row) => (
    <tr key={row.id}>
      <td
        style={{
          width: "5rem",
          fontWeight: row.parentId ? 400 : 700,
          textAlign: "center",
        }}
      >
        {row.parentId ? "" : row.kode}
      </td>
      <td
        style={{
          width: "5rem",
          fontWeight: row.parentId ? 400 : 700,
          textAlign: row.parentId ? "center" : "left",
        }}
        colSpan={row.parentId ? 1 : 2}
      >
        {row.parentId ? `${row.parentId}.${row.kode}` : row.nama}
      </td>
      {row.parentId && <td>{row.nama}</td>}
      <td>
        <Text
          sx={(theme) => ({
            color:
              row.tipe == "DEBET" ? theme.colors.green[5] : theme.colors.red[5],
          })}
        >
          {row.tipe}
        </Text>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table
        sx={{
          minWidth: 700,
          borderCollapse: "collapse",
        }}
      >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th style={{ width: "5rem" }}>Kode</th>
            <th style={{ width: "5rem" }} colSpan={2}>
              Nama
            </th>
            <th style={{ width: "10rem" }}>Tipe</th>
          </tr>
        </thead>
        <tbody className={classes.rows}>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};

export default function Index({ perkiraan, akun }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();

  const { data: session, status } = useSession();
  const getuserProp = () => {
    const data = akun ? akun : [];
    dispatch({ type: "set_data", payload: data });
  };
  useEffect(() => {
    getuserProp();
  }, []);

  const refreshHandler = async (isLoading = null, page = 1, search = "") => {
    const url = `/api/user?page=${page}&search=${search}`;
    const res = await fetch(url);
    const data = await res.json();

    dispatch({ type: "set_data", payload: { ...data, search, page } });
    isLoading(false);
  };

  return (
    <Layout session={session}>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Perkiraan</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data Perkiraan
      </Title>
      {/* <DataTable>
        <TablePerkiraan akun={akun} perkiraan={perkiraan} />
      </DataTable> */}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const perkiraan = await fetch(`${process.env.API_URL}/api/perkiraan`, {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  }).then((res) => res.json());

  const res = await fetch(`${process.env.API_URL}/api/akun`, {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  const akun = await res.json();

  const filterAkun = _.filter(akun, { parentId: null });

  return {
    props: {
      akun: filterAkun,
      perkiraan,
      session: await getSession(context),
    },
  };
}
