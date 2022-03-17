import Head from "next/head";

import Layout from "@components/views/Layout";
import {
  Title,
  Text,
  Box,
  MultiSelect,
  Button,
} from "@mantine/core";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Dots,
} from "tabler-icons-react";

import { CustomTable } from "@components/Table/CustomTable";
import DataTable from "@components/Table/DataTable";
import { formatDate } from "helpers/functions";

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
      key: "tipe",
      label: "Tipe",
    },
    {
      key: "merek",
      label: "Merek",
    },
    {
      key: "stok",
      label: "Stok",
    },
    {
      key: "satuan",
      label: "Satuan",
    },
    {
      key: "hargabeli",
      label: "Harga Beli",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
  ];
  return (
    <Layout>
      <Head>
        <title>Master Inventori</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Data Inventori
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
        <CustomTable header={header}>
          {produk.map((row) => {
            return (
              <CustomTable.Row key={row.id}>
                <CustomTable.Col>
                  <Text><div className="uppercase">{row.kode}</div></Text>
                </CustomTable.Col>
                <CustomTable.Col>
                  <Text><div className="uppercase">{row.nama}</div></Text>
                </CustomTable.Col>
                <CustomTable.Col>
                  <Button variant="subtle">VIEW(100)</Button>
                </CustomTable.Col>
                <CustomTable.Col>
                  <Button variant="subtle">VIEW(100)</Button>
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
