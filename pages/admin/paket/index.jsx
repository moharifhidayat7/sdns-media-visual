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
const URL = "/api/paket";
const NAMEPAGE = "paket";
export default function Index({ paket, fiturs }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const [modal, setModal] = useState({
    opened: false,
    title: "",
    data: [],
  });

  useEffect(() => {
    dispatch({ type: "set_data", payload: paket });
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
      key: "kode",
      label: "Kode",
    },
    {
      key: "nama",
      label: "Nama",
    },
    {
      key: "produk",
      label: "Produk",
    },
    {
      key: "harga",
      label: "Harga",
    },
    {
      key: "fiturs",
      label: "Fiturs",
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
        <title style={{ textTransform: "capitalize" }}>
          Master {NAMEPAGE}{" "}
        </title>
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
                    <Text className="uppercase">
                      {row.produk ? row.produk.nama : ""}
                    </Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">Rp.{row.harga}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text className="uppercase">
                      <Button
                        variant="subtle"
                        onClick={() =>
                          setModal({
                            opened: true,
                            title: `${row.kode} - ${row.nama}`,
                            data: row.fiturs,
                          })
                        }
                      >
                        VIEW({row.fiturs ? row.fiturs.length : 0})
                      </Button>
                    </Text>
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
      <ViewModal
        modal={{ modal, setModal }}
        fiturs={fiturs}
      />
    </Layout>
  );
}
const ViewModal = ({ modal, fiturs }) => {
  const [fiturPaket, setFiturPaket] = useState([])
  useEffect(() => {
    if (modal.modal.opened == true) {
      const data = modal.modal.data.map((row) => {
        return row.fiturId
      })
     setFiturPaket(data)
    }
  }, [modal.modal.opened])
  return (
    <Modal
      opened={modal.modal.opened}
      onClose={() => {
        modal.setModal({
          opened: false,
          data: []
        })
      }
      }
      size="sm"
      transition="rotate-left"
      title={<div className="uppercase">{modal.modal.title}</div>}

    >
      <Table>
        <thead>
          <tr>
            <th>Fitur</th>
            <th style={{ textAlign: "right" }}>Include</th>
          </tr>
        </thead>
        <tbody>
          {fiturs.result && fiturs.result.map((row) => {
            return (
              <tr key={row.id}>
                <td>{row.nama}</td>
                <td className="text-right"><CircleCheck color={fiturPaket.includes(row.id) ? 'green' : 'gray'} className={`text-gray-500 ml-5`} /></td>
              </tr>
            )
          })
          }
        </tbody>
      </Table>

    </Modal>
  );
}
export async function getServerSideProps(context) {
  const OPTION = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  const res = await fetch(`${process.env.API_URL}/api/paket`, OPTION);
  const paket = await res.json();
  const fiturs = await fetch(`${process.env.API_URL}/api/fitur?status=ACTIVE`, OPTION).then(res => res.json());
  return {
    props: {
      paket,
      fiturs
    },
  };
}
