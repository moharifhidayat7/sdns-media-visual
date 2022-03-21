import Head from "next/head";

import Layout from "@components/views/Layout";
import { Title, Text, Button, Modal, Table } from "@mantine/core";

import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { useContext, useEffect, useState } from "react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import dateFormat from "dateformat";
import { Check, H3, X } from "tabler-icons-react";
export default function Index({ inventori }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const [modalStokLog, setModalStokLog] = useState({
    opened: false,
    data: [],
  });

  useEffect(() => {
    dispatch({ type: "set_data", payload: inventori });
  }, []);
  const deleteHandler = async (selected, isLoading, type = "delete") => {
    const data = { id: selected };
    const url =
      type == "delete" ? `/api/inventori/${selected}` : `/api/inventori`;
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/inventori?page=${page}&search=${search}`;
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
        <title style={{ textTransform: "capitalize" }}>Master Inventori </title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data Inventori
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
          name="inventori"
          withSelection={true}
          withAction={true}
        >
          {state.data.result &&
            state.data.result.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id}
                  id={row.id}
                  readLink={`inventori/form?id=${row.id}&read=true`}
                  editLink={`/form?id=${row.id}`}
                  deleteField={row.nama}
                  onDelete={(isLoading) => deleteHandler(row.id, isLoading)}
                >
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
                    <Button
                      variant="subtle"
                      onClick={() =>
                        setModalStokLog({
                          opened: true,
                          title: `${row.kode} - ${row.nama} ${row.tipe} ${row.merek}`,
                          data: row.logstok,
                        })
                      }
                    >
                      VIEW({row.logstok ? row.logstok.length : 0})
                    </Button>
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
          onChange={(page, isLoading) => refreshHandler(isLoading, page)}
        />
      </DataTable>
      <ViewModalLogStok
        logstok={modalStokLog}
        setModalStokLog={setModalStokLog}
      />
    </Layout>
  );
}
const ViewModalLogStok = ({ logstok, setModalStokLog }) => {
  //sum stok total
  const sumStok = logstok.data.reduce((acc, cur) => {
    return acc + cur.stok;
  }, 0);

  return (
    <Modal
      opened={logstok.opened}
      onClose={() =>
        setModalStokLog({
          opened: false,
          data: [],
        })
      }
      size="lg"
      transition="rotate-left"
      title={logstok.title}
    >
      <Table verticalSpacing="xs" className="border">
        <thead>
          <tr>
            <th>NO</th>
            <th>Unique Date Log</th>
            <th>Created On</th>
            <th>Stok</th>
          </tr>
        </thead>
        <tbody>
          {logstok.data.map((element, key) => (
            <tr key={element.id}>
              <td>{key + 1}</td>
              <td>{element.datelog}</td>
              <td>{dateFormat(element.createdAt, "dd-mm-yyyy")}</td>
              <td>{element.stok}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3">Total</th>
            <th>{sumStok}</th>
          </tr>
        </tfoot>
      </Table>
    </Modal>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.API_URL}/api/inventori/`);
  const inventori = await res.json();
  return {
    props: {
      inventori,
    },
  };
}
