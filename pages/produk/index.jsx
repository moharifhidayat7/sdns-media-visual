import Head from "next/head";

import Layout from "@components/views/Layout";
import {
  Title,
  Text,
  Box,
  MultiSelect,
  Button,
} from "@mantine/core";

import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { formatDate } from "helpers/functions";
import { useContext, useEffect } from "react";


export default function Index({ produk }) {
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
      key: "createdAt",
      label: "Created At",
    },
  ];

  
  return (
    <Layout>

      <Head>
        <title>Master Produk</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Data Produk
      </Title>
      <DataTable>
        <DataTable.Action />
        <DataTable.Filter onFilter={() => { }}>
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
        <CustomTable header={header} className="uppercase">
          {produk.map((row) => {
            return (
              <CustomTable.Row key={row.id}>
                <CustomTable.Col>
                  <Text>{row.kode}</Text>
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
                  <Text className="uppercase">{formatDate(row.createdAt)}</Text>
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
//function get server side props produk
export async function getServerSideProps(context) {
  const res = await fetch(`http://localhost:3000/api/produk`);
  const produk = await res.json();
  return {
    props: {
      produk,
    },
  }
}
