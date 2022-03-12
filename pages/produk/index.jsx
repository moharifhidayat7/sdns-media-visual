import Head from "next/head";
import { Title, Box } from "@mantine/core";

export default function Index() {
  return (
    <>
      <Head>
        <title>Master Produk</title>
      </Head>
      <Title order={1} style={{ marginBottom: "1.5rem" }}>
        Data Produk
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
        this is box
      </Box>
    </>
  );
}
