import Head from "next/head";

import Layout from "@components/views/Layout";
import { Title, Text, Button } from "@mantine/core";

import DataTable from "@components/Table/DataTable";
import { AkunTable } from "@components/Table/AkunTable";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import _ from "lodash";

export default function Index({ akun }) {
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
        <title style={{ textTransform: "capitalize" }}>Akun</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data Akun
      </Title>
      <DataTable>
        <DataTable.Action
          refreshVisibility={false}
          filterVisibility={false}
          searchVisibility={false}
        />
        <AkunTable data={akun} />
      </DataTable>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.API_URL}/api/akun`, {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  const akun = await res.json();

  // const filterAkun = _.filter(akun.result, { parentId: 0 });
  // const sortAkun = _.filter(filterAkun, "kode");
  return {
    props: {
      akun: akun.result,
      session: await getSession(context),
    },
  };
}
