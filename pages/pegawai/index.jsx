import Head from "next/head";
import { Title, Text, MultiSelect } from "@mantine/core";

import { CustomTable } from "@components/Table/CustomTable";
import Layout from "@components/views/Layout";
import DataTable from "@components/Table/DataTable";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useEffect } from "react";
import { useNotifications } from "@mantine/notifications";

import { formatDate } from "helpers/functions";
import { Check, X } from "tabler-icons-react";

export default function Index({ users }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();

  const header = [
    {
      key: "username",
      label: "Username",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "roles",
      label: "Role",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
    {
      key: "createdBy",
      label: "Created By",
    },
  ];

  const deleteData = async (selected, isLoading) => {
    // fetch delete many
    console.log("fetch delete many: ", selected);

    // if error set loading to false
    setTimeout(() => isLoading(false), 3000);

    // if success delete data from state
    dispatch({
      type: "delete_many",
      payload: selected,
    });
  };

  const refreshData = async (isLoading) => {
    await fetch("/api/user")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatch({ type: "set_data", payload: res });
        isLoading(false);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Refresh Data",
          message: "Refresh data berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
      })
      .catch((e) => {
        isLoading(false);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Refresh Data",
          message: "Refresh data gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      });
  };

  useEffect(() => {
    const getUsersProp = () => {
      const data = users;
      dispatch({ type: "set_data", payload: data });
    };

    getUsersProp();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Data Pegawai</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Pegawai
      </Title>

      <DataTable>
        <DataTable.Action
          onEdit={(selected) => console.log(selected)}
          onDelete={deleteData}
          onRefresh={refreshData}
        />
        <DataTable.Filter onFilter={() => {}}>
          <div>
            <MultiSelect
              data={[
                "React",
                "Angular",
                "Svelte",
                "Vue",
                "Riot",
                "Next.js",
                "Blitz.js",
              ]}
              label="Roles"
              placeholder="Pick all that you like"
              defaultValue={["react", "next"]}
              clearButtonLabel="Clear selection"
              clearable
              searchable
              nothingFound="Nothing found"
            />
          </div>
          <div>
            <MultiSelect
              data={[
                "React",
                "Angular",
                "Svelte",
                "Vue",
                "Riot",
                "Next.js",
                "Blitz.js",
              ]}
              label="Roles"
              placeholder="Pick all that you like"
              defaultValue={["react", "next"]}
              clearButtonLabel="Clear selection"
              clearable
              searchable
              nothingFound="Nothing found"
            />
          </div>
        </DataTable.Filter>
        <CustomTable
          header={header}
          withSelection={true}
          withAction={true}
          name="User"
        >
          {state.data &&
            state.data.map((row) => {
              return (
                <CustomTable.Row
                  key={row.id}
                  id={row.id}
                  onDelete={(isLoading) => {
                    // fetch delete
                    console.log("fetch delete");
                    // if error set loading to false
                    setTimeout(() => isLoading(false), 3000);

                    // if success delete data from state
                    dispatch({
                      type: "delete",
                      payload: row.id,
                    });
                  }}
                  editLink={`/form?${row.id}`}
                  deleteField={row.username}
                >
                  <CustomTable.Col>
                    <Text>{row.username}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>{row.email}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>ROLE</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>{formatDate(row.createdAt)}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>test</Text>
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

export const getServerSideProps = async (ctx) => {
  const users = await fetch("http://localhost:3000/api/user").then((res) =>
    res.json()
  );

  return {
    props: {
      users,
    },
  };
};
