import Head from "next/head";
import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from "@mantine/core";

import Layout from "@components/views/Layout";

import Link from "next/link";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export default function Custom403() {
  const { classes } = useStyles();

  return (
    <Layout>
      <Head>
        <title>403 Forbidden</title>
      </Head>
      <Container className={classes.root}>
        <div className={classes.label}>403</div>
        <Title className={classes.title}>
          Anda tidak memiliki akses ke halaman ini.
        </Title>
        <Text
          color="dimmed"
          size="lg"
          align="center"
          className={classes.description}
        >
          Halaman terproteksi.
        </Text>
        <Group position="center">
          <Link href="/admin" passHref>
            <Button component="a" variant="subtle" size="md">
              Kembali ke Dashboard
            </Button>
          </Link>
        </Group>
      </Container>
    </Layout>
  );
}
