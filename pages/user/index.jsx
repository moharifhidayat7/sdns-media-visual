import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  Title,
  Text,
  Button,
  MultiSelect,
} from "@mantine/core";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Dots,
} from "tabler-icons-react";

import { CustomTable } from "@components/Table/CustomTable";
import Layout from "@components/views/Layout";
import DataTable from "@components/Table/DataTable";

const PaginationItem = ({ page, active, onClick = () => {}, ...props }) => {
  const icons = {
    dots: Dots,
    next: ChevronRight,
    prev: ChevronLeft,
    first: ChevronsLeft,
    last: ChevronsRight,
  };

  const Item = icons[page];
  const children = Item ? <Item size={15} /> : page;
  return (
    <Button onClick={onClick} {...props} size="sm">
      {children}
    </Button>
  );
};

export default function Index() {
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

  const data = [
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
    {
      id: "3",
      avatar:
        "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Henry Silkeater",
      job: "Designer",
      email: "henry@silkeater.io",
    },
    {
      id: "4",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Bill Horsefighter",
      job: "Designer",
      email: "bhorsefighter@gmail.com",
    },
    {
      id: "5",
      avatar:
        "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jeremy Footviewer",
      job: "Manager",
      email: "jeremy@foot.dev",
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
        <DataTable.Action />
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
        <CustomTable header={header}>
          {data.map((row) => {
            return (
              <CustomTable.Row key={row.id}>
                <CustomTable.Col>
                  <Text>COBA</Text>
                </CustomTable.Col>
                <CustomTable.Col>
                  <Text>COBA</Text>
                </CustomTable.Col>
                <CustomTable.Col>
                  <Text>COBA</Text>
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
