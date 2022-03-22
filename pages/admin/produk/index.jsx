import Head from "next/head";

import Layout from "@components/views/Layout";
import { Title, Text, Button } from "@mantine/core";

import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { useContext, useEffect } from "react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import dateFormat from "dateformat";
import { Check, X } from "tabler-icons-react";

export default function Index({ produk }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const getProdukProp = () => {
    const data = produk ? produk : [];
    dispatch({ type: "set_data", payload: data });
  };
  useEffect(() => {
    getProdukProp();
  }, []);
  const deleteHandler = async (selected, isLoading, type = "delete") => {
    const data = { id: selected };
    const url = type == "delete" ? `/api/produk/${selected}` : `/api/produk`;
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
  const refreshHandler = async (isLoading = null, page = 1, search = "") => {
    const url = `/api/produk?page=${page}&search=${search}`;
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
      key: "nama",
      label: "Nama",
    },
    {
      key: "paket",
      label: "Paket",
    },
    {
      key: "pelanggan",
      label: "Pelanggan",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
  ];
  return (
    <Layout>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Master Produk </title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data Produk
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
          name="produk"
          withSelection={true}
          withAction={true}
        >
          {state.data.result &&
            state.data.result.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id}
                  id={row.id}
                  readLink={`produk/form?id=${row.id}&read=true`}
                  editLink={`/form?id=${row.id}`}
                  deleteField={row.nama}
                  onDelete={(isLoading) => {
                    deleteHandler(row.id, isLoading);
                  }}
                >
                  <CustomTable.Col>
                    <Text className="">{row.kode}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{row.nama}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Button variant="subtle">VIEW(10)</Button>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Button variant="subtle">VIEW(100)</Button>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{row.status}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">
                      {dateFormat(row.createdAt, "dd-mm-yyyy")}
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
//function get server side props produk
export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.API_URL}/api/produk?page=0`);
  const produk = await res.json();
  return {
    props: {
      produk,
    },
  };
}
