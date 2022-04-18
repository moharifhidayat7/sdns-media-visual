import Head from "next/head";

import Layout from "@components/views/Layout";
import { Title, Text } from "@mantine/core";
import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { useEffect } from "react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { Check, X } from "tabler-icons-react";
import { useSession, getSession } from "next-auth/react";
import { useNotifications } from "@mantine/notifications";
import dateFormat from "dateformat";

export default function Index({ vouchers }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const { data: session, status } = useSession();

  const deleteHandler = async (selected, isLoading, type = "delete") => {
    const data = { id: selected };
    const url = type == "delete" ? `/api/voucher/${selected}` : `/api/voucher`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      isLoading(false);
      if (res.status === 200) {
        dispatch({ type: type, payload: selected });
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete voucher",
          message: "Delete voucher berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete voucher",
          message: "Delete voucher gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };
  const refreshHandler = async (isLoading = null, page = 1, search = "") => {
    const url = `/api/voucher?page=${page}&search=${search}`;
    const res = await fetch(url);
    const data = await res.json();

    dispatch({ type: "set_data", payload: { ...data, search, page } });
    isLoading(false);
  };
  const header = [
    {
      key: "kode",
      label: "Kode",
    },
    {
      key: "perpanjangan",
      label: "Perpanjangan",
    },
    {
      key: "expiredAt",
      label: "Tanggal Kadaluarsa",
    },
  ];
  useEffect(() => {
    dispatch({ type: "set_data", payload: vouchers });
  }, []);
  return (
    <Layout session={session}>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Voucher</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data Voucher
      </Title>
      <DataTable>
        <DataTable.Action
          filterVisibility={false}
          onDelete={(selected, isLoading) => {
            deleteHandler(selected, isLoading, "delete_many");
          }}
          onRefresh={(isLoading) => refreshHandler(isLoading)}
          onSearch={(value, isLoading) => refreshHandler(isLoading, 1, value)}
        />
        <CustomTable
          header={header}
          name="voucher"
          withSelection={true}
          withAction={true}
        >
          {state.data.result &&
            state.data.result.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id}
                  id={row.id}
                  deleteField={row.kode}
                  onDelete={(isLoading) => {
                    deleteHandler(row.id, isLoading);
                  }}
                >
                  <CustomTable.Col>
                    <Text>{row.kode}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>{row.perpanjangan} Bulan</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>
                      {row.expiredAt
                        ? dateFormat(row.expiredAt, "dd-mm-yyyy")
                        : "-"}
                    </Text>
                  </CustomTable.Col>
                </CustomTable.Row>
              );
            })}
        </CustomTable>
        <DataTable.Footer
          total={state.data.total}
          pages={state.data.pages}
          onChange={(page, isLoading) =>
            refreshHandler(isLoading, page, state.data.search)
          }
        />
      </DataTable>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.API_URL}/api/voucher?page=0`, {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  const vouchers = await res.json();

  return {
    props: {
      vouchers,
      session: await getSession(context),
    },
  };
}
