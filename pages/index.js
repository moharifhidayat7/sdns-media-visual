import Head from "next/head";
import { Title, Box, Button } from "@mantine/core";
import Link from "next/link";
import Layout from "@components/views/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <Title order={1} style={{ marginBottom: "1.5rem" }}>
        Homepage
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
        <Link href="/login" passHref>
          <Button component="a">Login</Button>
        </Link>
      </Box>
    </>
  );
}
