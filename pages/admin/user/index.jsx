import Head from "next/head";
import { Title, Text, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";

import { CustomTable } from "@components/Table/CustomTable";
import Layout from "@components/views/Layout";
import DataTable from "@components/Table/DataTable";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useEffect } from "react";
import { useNotifications } from "@mantine/notifications";
import { useDebouncedValue } from "@mantine/hooks";
import { formatDate } from "helpers/functions";
import { Check, X } from "tabler-icons-react";

export default function Index({ users }) {
  const [state, dispatch] = useGlobalContext();
  const notifications = useNotifications();

  const form = useForm({
    initialValues: {
      roles: "",
      roles2: "",
    },
  });

  useEffect(() => {
    const getUsersProp = () => {
      const data = users;

      dispatch({ type: "set_data", payload: data });
    };

    getUsersProp();
  }, []);

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
      key: "createdAt",
      label: "Created At",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>User</title>
      </Head>
      <Title order={1} style={{ marginBottom: "1.5rem" }}>
        Data User
      </Title>

      <DataTable>
        <DataTable.Action
          onSearch={(keyword) => {
            console.log(keyword); // search keyword
            console.log(form.values); // filter values

            // fetch search & filter
            const data = [];
            // then

            // set data
            dispatch({ type: "set_data", payload: data });
          }}
          onEdit={(selected) => console.log(selected)}
          onDelete={(selected, isLoading) => {
            // fetch delete many
            console.log("fetch delete many: ", selected);

            // if error set loading to false
            setTimeout(() => isLoading(false), 3000);

            // if success delete data from state
            dispatch({
              type: "delete_many",
              payload: selected,
            });
          }}
          onRefresh={(isLoading) => {
            // fetch data
            console.log("fetch data");
            const result = [
              {
                id: 1,
                username: "tes refresh",
                email: "tes refresh",
                createdAt: new Date(),
              },
            ];

            // if error set loading to false
            setTimeout(() => isLoading(false), 3000);
            notifications.showNotification({
              disallowClose: true,
              autoClose: 5000,
              title: "Refresh Data",
              message: "Refresh data gagal",
              color: "red",
              icon: <X />,
              loading: false,
            });
            // if success set data
            dispatch({ type: "set_data", payload: result });
            notifications.showNotification({
              disallowClose: true,
              autoClose: 5000,
              title: "Refresh Data",
              message: "Refresh data berhasil",
              color: "green",
              icon: <Check />,
              loading: false,
            });
          }}
        />
        <DataTable.Filter
          form={form}
          onFilter={(values) => console.log(values)}
        >
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
              clearButtonLabel="Clear selection"
              clearable
              searchable
              nothingFound="Nothing found"
              {...form.getInputProps("roles")}
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
              clearButtonLabel="Clear selection"
              clearable
              searchable
              nothingFound="Nothing found"
              {...form.getInputProps("roles2")}
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
                    <Text>{formatDate(row.createdAt)}</Text>
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
  const users = await fetch(`${process.env.API_URL}/api/user`).then((res) =>
    res.json()
  );

  return {
    props: {
      users,
    },
  };
};
