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
  SimpleGrid,
  Table,
  Text,
  Input,
  Stack,
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
              <InputWrapper required>
                <Group direction="row">
                  <Input
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
                  <tr>
                    <td style={{ width: "200px" }}>
                      <Text weight={500} size="sm">
                        Tanggal Pendaftaran
                      </Text>
                    </td>
                    <td>{elements.name}</td>
                  </tr>
                  <tr>
                    <td style={{ width: "200px" }}>
                      <Text weight={500} size="sm">
                        Paket
                      </Text>
                    </td>
                    <td>{elements.name}</td>
                  </tr>
                  <tr>
                    <td style={{ width: "200px" }}>
                      <Text weight={500} size="sm">
                        Kolektor
                      </Text>
                    </td>
                    <td>{elements.name}</td>
                  </tr>
                </tbody>
              </Table>
            </Group>
          </Grid.Col>
          <Grid.Col sm={12} md={6}>
            <Group direction="column" grow spacing="lg">
              <Title order={4}>Tagihan</Title>
              <Stack spacing="xs">
                <Box
                  sx={(theme) => ({
                    padding: theme.spacing.md,
                    border: "1px solid",
                    borderColor: theme.colors.dark[2],
                    borderRadius: theme.radius.sm,
                  })}
                >
                  <SimpleGrid cols={2}>
                    <div>
                      <Text weight={500}>Maret 2022</Text>
                      <Text size="sm">Paket Rumahan</Text>
                    </div>

                    <div className="text-right">
                      <Text weight={500}>Rp. 20.000</Text>
                    </div>
                  </SimpleGrid>
                </Box>
                <Box
                  sx={(theme) => ({
                    padding: theme.spacing.md,
                    border: "1px solid",
                    borderColor: theme.colors.dark[2],
                    borderRadius: theme.radius.sm,
                  })}
                >
                  <SimpleGrid cols={2}>
                    <div>
                      <Text weight={500}>Maret 2022</Text>
                      <Text size="sm">Paket Rumahan</Text>
                    </div>

                    <div className="text-right">
                      <Text weight={500}>Rp. 20.000</Text>
                    </div>
                  </SimpleGrid>
                </Box>
                <Box
                  sx={(theme) => ({
                    padding: theme.spacing.md,
                    border: "1px solid",
                    borderColor: theme.colors.dark[2],
                    borderRadius: theme.radius.sm,
                  })}
                >
                  <SimpleGrid cols={2}>
                    <div>
                      <Text weight={500}>Maret 2022</Text>
                      <Text size="sm">Paket Rumahan</Text>
                    </div>

                    <div className="text-right">
                      <Text weight={500}>Rp. 20.000</Text>
                    </div>
                  </SimpleGrid>
                </Box>
              </Stack>
              <Table>
                <tbody>
                  <tr className="text-right">
                    <td>Diskon :</td>
                    <td style={{ width: "150px" }}>Rp. 0</td>
                  </tr>
                  <tr>
                    <td className="text-right">
                      <Text weight={500} size="xl" className="text-right">
                        Total :
                      </Text>
                    </td>
                    <td style={{ width: "150px", textAlign: "right" }}>
                      <Text weight={500} size="xl" className="text-right">
                        Rp. 200.000
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Button type="submit">Bayar</Button>
            </Group>
          </Grid.Col>
        </Grid>
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
