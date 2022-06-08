import Head from "next/head";
import { Title, List, ThemeIcon, Grid, SimpleGrid, Skeleton, useMantineTheme, Paper, Text } from "@mantine/core";

import Layout from "@components/views/Layout";
import { useSession, getSession } from "next-auth/react";
import { StatsGrid } from "@components/Card/Default";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CircleCheck, CircleDashed } from 'tabler-icons-react';
import { useEffect } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);
const PRIMARY_COL_HEIGHT = 400;
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'KAS CHART BAR',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const datas = {
  labels,
  datasets: [
    {
      label: 'Kredit',
      data: [200, 22, 22, 22, 22, 90, 100],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Debit',
      data: [30, 100, 50, 80, 212, 150, 10],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
export default function Home({notifikasi,pelanggan}) {
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  const { data: session } = useSession();

  const Card = [
    {
      "title": "Pelanggan",
      "icon": "users",
      "value": pelanggan.total,
      "diff": -13
    },
    {
      "title": "Kredit",
      "icon": "coinoff",
      "value": "Rp. 100.000",
      "diff": 7
    },
    {
      "title": "Debit",
      "icon": "coin",
      "value": "Rp. 500.000",
      "diff": 50
    },
    {
      "title": "Asset",
      "icon": "asset",
      "value": "1",
      "diff": 1
    }
  ]

  return (
    <Layout session={session}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Title order={1} style={{ marginBottom: "1.5rem" }}>
        Dashboard
      </Title>
      <StatsGrid data={[...Card]} />

      <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]} style={{ marginTop: "1.5rem" }}>
        <Paper withBorder radius="md" className="p-5" >
          <Text size="xs" color="dimmed" className="font-semibold uppercase">
            KAS CHART BAR
          </Text>
          <Bar height={SECONDARY_COL_HEIGHT} options={options} data={datas} /></Paper>
        <Grid gutter="md">
          <Grid.Col >
            <Paper withBorder shadow="xs" p="xs" >
              <Text size="xs" color="dimmed" className="font-semibold uppercase mb-2">
                NOTIFICATION
              </Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <CircleCheck size={16} />
                  </ThemeIcon>
                }
              >
                {notifikasi.result&&notifikasi.result.map((item, index) => (
                  <List.Item key={index}>
                    <Text size="xs" color="dimmed">{item.title}</Text>
                  </List.Item>
                ))}
              </List>
            </Paper>
          </Grid.Col>
          {/* <Grid.Col span={6}>
            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
          </Grid.Col> */}
        </Grid>
      </SimpleGrid>


    </Layout>
  );
}

export async function getServerSideProps(context) {
  const OPTION = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  const notifikasi = await fetch(`${process.env.API_URL}/api/notifikasi`, OPTION);
  const pelanggan= await fetch(`${process.env.API_URL}/api/pelanggan`, OPTION);
  return {
    props: {
      session: await getSession(context),
      notifikasi: await notifikasi.json(),
      pelanggan: await pelanggan.json(),
    },
  };
}
