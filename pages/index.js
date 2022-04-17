import Head from "next/head";
import { Title, Box, Button } from "@mantine/core";

import Layout from "@components/views/Layout";

import { useSession, getSession } from "next-auth/react";
export default function Home() {
  const { data: session, status } = useSession();
  return (
    <Layout session={session}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Title order={1} style={{ marginBottom: "1.5rem" }}>
        Dashboard
      </Title>
      <Box
        sx={(theme) => ({
          border: "1px solid",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        <Button>My compact button</Button>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
};
