import { useState, forwardRef } from "react";
import { useSession, getSession } from "next-auth/react";
import Layout from "@components/views/Layout";
import {
  Loader,
  Title,
  Box,
  Grid,
  Group,
  TextInput,
  Select,
  Table,
  Text,
  Input,
  InputWrapper,
  Button,
} from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";

const BayarTagihan = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const elements = { position: 6, mass: 12.011, symbol: "C", name: "Carbon" };

  return (
    <Layout session={session}>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Pembayaran Tagihan</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Pembayaran Tagihan
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
        <Grid>
          <Grid.Col sm={12} md={6}>
            <Group direction="column" grow spacing="lg">
              <InputWrapper required label="ID Pelanggan">
                <Group direction="row">
                  <Input
                    label="ID Pelanggan"
                    name="ID Pelanggan"
                    placeholder="ID Pelanggan"
                    className="flex-grow"
                    size="lg"
                  />
                  <Button size="lg">Cari</Button>
                </Group>
              </InputWrapper>
              <InputWrapper label="Info"></InputWrapper>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: "200px" }}>
                      <Text weight={500} size="sm">
                        ID Pelanggan
                      </Text>
                    </td>
                    <td>{elements.name}</td>
                  </tr>
                  <tr>
                    <td style={{ width: "200px" }}>
                      <Text weight={500} size="sm">
                        Nama Pelanggan
                      </Text>
                    </td>
                    <td>{elements.name}</td>
                  </tr>
                  <tr>
                    <td style={{ width: "200px" }}>
                      <Text weight={500} size="sm">
                        Alamat
                      </Text>
                    </td>
                    <td>{elements.name}</td>
                  </tr>
                </tbody>
              </Table>
            </Group>
          </Grid.Col>
        </Grid>

        <div className="space-x-2 mt-10">
          <Button
            type="button"
            onClick={() => router.push(`/admin/${PATHNAME}`)}
            color="red"
          >
            Back
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </Box>
    </Layout>
  );
};

export default BayarTagihan;

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
};
