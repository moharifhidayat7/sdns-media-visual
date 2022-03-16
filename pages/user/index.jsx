import Head from "next/head";
import { Title, Text, MultiSelect } from "@mantine/core";

import { CustomTable } from "@components/Table/CustomTable";
import Layout from "@components/views/Layout";
import DataTable from "@components/Table/DataTable";
import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useEffect } from "react";

export default function Index({ users }) {
  const [state, dispatch] = useGlobalContext();

  useEffect(() => {
    const getUsersProp = () => {
      const data = users;
      dispatch({ type: "set_data", payload: data });
    };

    getUsersProp();
  }, []);

  const header = [
    {
      key: "name",
      label: "Nama",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "job",
      label: "Job",
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
          onEdit={(selected) => console.log(selected)}
          onDelete={(selected) => console.log("fetch delete many:" + selected)}
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
                  onDelete={() => console.log("fetch delete")}
                  editLink={`/form?${row.id}`}
                  deleteField={row.name}
                >
                  <CustomTable.Col>
                    <Text>{row.name}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>{row.email}</Text>
                  </CustomTable.Col>
                  <CustomTable.Col>
                    <Text>{row.job}</Text>
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
  return {
    props: {
      users: [
        {
          id: "1",
          avatar:
            "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
          name: "Robert Wolfkisser",
          job: "Engineer",
          email: "rob_wolf@gmail.com",
        },
        {
          id: "2",
          avatar:
            "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
          name: "Jill Jailbreaker",
          job: "Engineer",
          email: "jj@breaker.com",
        },
      ],
    },
  };
};
