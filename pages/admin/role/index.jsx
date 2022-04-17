import Head from "next/head";

import Layout from "@components/views/Layout";
import { Title, Text, Button, Table, Checkbox } from "@mantine/core";
import { useModals } from "@mantine/modals";

import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { useContext, useState, useEffect } from "react";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useSession, getSession } from "next-auth/react";

export default function Index({ roles }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();
  const [row, setRow] = useState([]);
  const modals = useModals();

  const { data: session, status } = useSession();

  const openAksesModal = (row) => {
    modals.openModal({
      title: row.nama,
      overflow: "inside",
      size: "lg",
      children: (
        <Table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>URL</th>
              <th>Akses</th>
            </tr>
          </thead>
          <tbody>
            {row.akses.map((ak) => {
              if (ak.read == false && ak.write == false) {
                return;
              }
              return (
                <tr key={`${ak.nama}_${ak.path}`}>
                  <td>{ak.nama}</td>
                  <td>{ak.path}</td>
                  <td>
                    {ak.read && (
                      <Checkbox
                        value="read"
                        label="READ"
                        checked={ak.read}
                        disabled
                      />
                    )}
                    {ak.write && (
                      <Checkbox
                        value="write"
                        label="WRITE"
                        checked={ak.write}
                        disabled
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ),
    });
  };

  const deleteHandler = async (selected, isLoading, type = "delete") => {
    const data = { id: selected };
    const url = type == "delete" ? `/api/role/${selected}` : `/api/role`;
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
          title: "Delete role",
          message: "Delete role berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Delete role",
          message: "Delete role gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };
  const refreshHandler = async (isLoading = null, page = 1, search = "") => {
    const url = `/api/role?page=${page}&search=${search}`;
    const res = await fetch(url);
    const data = await res.json();

    dispatch({ type: "set_data", payload: { ...data, search, page } });
    isLoading(false);
  };
  const header = [
    {
      key: "nama",
      label: "Role",
    },
    {
      key: "akses",
      sortable: false,
      label: "Akses",
    },
  ];
  useEffect(() => {
    dispatch({ type: "set_data", payload: roles });
  }, []);
  return (
    <Layout session={session}>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Role</title>
      </Head>
      <Title
        order={2}
        style={{ marginBottom: "1.5rem", textTransform: "capitalize" }}
      >
        Data Role
      </Title>
      <DataTable>
        <DataTable.Action
          filterVisibility={false}
          onRefresh={(isLoading) => refreshHandler(isLoading)}
          onSearch={(value, isLoading) => refreshHandler(isLoading, 1, value)}
        />
        <CustomTable header={header} name="produk" withAction={true}>
          {state.data.result &&
            state.data.result.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id}
                  id={row.id}
                  editLink={`/form?id=${row.id}`}
                  deleteField={row.nama}
                  onDelete={(isLoading) => {
                    deleteHandler(row.id, isLoading);
                  }}
                >
                  <CustomTable.Col>
                    <Text>{row.nama}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>
                      <Button
                        variant="subtle"
                        onClick={() => {
                          openAksesModal(row);
                        }}
                      >
                        VIEW
                      </Button>
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
  const res = await fetch(`${process.env.API_URL}/api/role?page=0`, {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  const roles = await res.json();

  return {
    props: {
      roles,
      session: await getSession(context),
    },
  };
}
