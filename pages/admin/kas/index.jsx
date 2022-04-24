import Head from "next/head";
import Layout from "@components/views/Layout";
import { Title, Text, Button, Modal, Table } from "@mantine/core";
import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { useContext, useEffect, useState } from "react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import dateFormat from "dateformat";
import { Check, X, CircleCheck } from "tabler-icons-react";
import { useSession, getSession } from "next-auth/react";
import { convertToRupiah } from "helpers/functions";

const URL = "/api/kas";
const NAMEPAGE = "Kas";
export default function Index({ result }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const { data: session, status } = useSession();
  useEffect(() => {
    dispatch({ type: "set_data", payload: result });
  }, []);
  const deleteHandler = async (selected, isLoading, type = "delete") => {
    const data = { id: selected };
    const url = type == "delete" ? `${URL}/${selected}` : URL;
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
  const refreshHandler = async (isLoading, page = 1, search = "") => {
    const res = await fetch(`${URL}?page=${page}&search=${search}`);
    const data = await res.json();
    dispatch({ type: "set_data", payload: { ...data, search, page } });
    isLoading(false);
  };
  const header = [
    {
      key: "tanggal",
      label: "Tanggal",
    },
    {
      key: "noakun",
      label: "Akun",
    },
    {
      key: "keterangan",
      label: "Keterangan",
    },
    { key: "debet", label: "Debet" },
    { key: "kredit", label: "Kredit" },
  ];
  return (
    <Layout session={session}>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Master {NAMEPAGE}</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data {NAMEPAGE}
      </Title>
      <DataTable>
        <DataTable.Action
          filterVisibility={false}
          onDelete={(selected, isLoading) =>
            deleteHandler(selected, isLoading, "delete_many")
          }
          onRefresh={(isLoading) => refreshHandler(isLoading)}
          onSearch={(search, isLoading) => refreshHandler(isLoading, 1, search)}
        />
        <CustomTable
          header={header}
          name={NAMEPAGE}
          withSelection={true}
          withAction={true}
        >
          {state.data.result &&
            state.data.result.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id}
                  id={row.id}
                  readLink={`/form?id=${row.id}&read=true`}
                  editLink={`/form?id=${row.id}`}
                  deleteField={row.createdAt}
                  onDelete={(isLoading) => deleteHandler(row.id, isLoading)}
                >
                  <CustomTable.Col>
                    <Text>{dateFormat(row.createdAt, "dd/mm/yy")}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">
                      {row.akun && `${row.akun.kode} - ${row.akun.nama}`}
                    </Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">
                      {row.keterangan}
                    </Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="">
                      {row.akun && row.akun.tipe == "DEBET" ?"Rp."+ convertToRupiah(row.saldo) : ""}
                    </Text>
                  </CustomTable.Col>

                  <CustomTable.Col>
                    <Text className=" text-red-500">
                      {row.akun && row.akun.tipe == "KREDIT" ? "Rp." + convertToRupiah(row.saldo) : ""}
                    </Text>
                  </CustomTable.Col>
                </CustomTable.Row>
              );
            })}
        </CustomTable>
        <DataTable.Footer
          total={state.data.total}
          pages={state.data.pages}
          onChange={(page, isLoading) => refreshHandler(isLoading, page)}
        />
      </DataTable>
    </Layout>
  );
};
export async function getServerSideProps(context) {
  const OPTION = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  const session = await getSession(context);
  const res = await fetch(`${process.env.API_URL}/api/kas`, OPTION);
  const result = await res.json();
  return {
    props: {
      result,
      session,
    },
  };
}

