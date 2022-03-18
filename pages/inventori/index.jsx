import Head from "next/head";

import Layout from "@components/views/Layout";
import {
  Title,
  Text,
  Button,
} from "@mantine/core";

import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { useContext, useEffect } from "react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import dateFormat from "dateformat";
import { Check, X } from "tabler-icons-react";
export default function Index({ inventori }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const getProdukProp = () => {
    const data = inventori;
    dispatch({ type: "set_data", payload: data });
  };
  useEffect(() => {
    getProdukProp();
  }, []);
  const deleteHandler = async (selected, isLoading, type = "delete") => {
    const data = { id: selected };
    const url = type == 'delete' ? `/api/inventori/${selected}` : `/api/inventori`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      isLoading(false);
      if (res.status === 200) {
        if (type != "delete") {
          selected.forEach(id => {
            dispatch({ type: "delete", payload: id });
          });
        } else {
          dispatch({ type: "delete", payload: selected });
        }
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete",
          message: "Delete data berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        })
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete",
          message: "Delete data gagal",
          color: "red",
          icon: <X />,
          loading: false,
        })
      }
    });
  }
  const refreshHandler = async (isLoading) => {
    const res = await fetch(`http://localhost:3000/api/inventori/`);
    const data = await res.json();
    dispatch({ type: "set_data", payload: data });
    isLoading(false);
  }
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
      key: "tipe",
      label: "Tipe",
    },
    {
      key: "merek",
      label: "Merek",
    },
    {
      key: "satuan",
      label: "Satuan",
    },
    {
      key: "logstok",
      label: "Log Stok",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
  ];


  return (
    <Layout>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Master Inventori </title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}>
        Data Inventori
      </Title>
      <DataTable>
        <DataTable.Action
          onDelete={(selected, isLoading) => deleteHandler(selected, isLoading, "many")}
          onRefresh={(isLoading) => refreshHandler(isLoading)} />
        <CustomTable header={header} name="inventori"
          withSelection={true} withAction={true}>
          {state.data &&
            state.data.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id} id={row.id}
                  readLink={`inventori/form?id=${row.id}&read=true`}
                  editLink={`/form?id=${row.id}`}
                  deleteField={row.nama}
                  onDelete={(isLoading) => deleteHandler(row.id, isLoading)} >
                  <CustomTable.Col>
                    <Text>{row.kode}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{row.nama}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{row.tipe}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{row.merek}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{row.satuan}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Button variant="subtle">VIEW({row.logstok.length})</Button>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">{dateFormat(row.createdAt, "dd-mm-yyyy")}</Text>
                  </CustomTable.Col>
                </CustomTable.Row>
              );
            })}
        </CustomTable>
        <DataTable.Footer />
      </DataTable>

    </Layout>
  );
}
export async function getServerSideProps(context) {

    const res = await fetch(`http://localhost:3000/api/inventori/`);
    const inventori = res.status === 200 ? await res.json() : [];
    return {
      props: {
       inventori,
      },
    }; 

}
