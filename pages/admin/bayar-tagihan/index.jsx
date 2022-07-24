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
  Checkbox,
  Text,
  Input,
  Stack,
  InputWrapper,
  Button,
} from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useModals } from "@mantine/modals";

const BayarTagihan = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const modals = useModals();

  const openBayarModal = () =>
    modals.openModal({
      title: "Bayar Tagihan",
      children: (
        <>
          <Title order={5}>Info Pelanggan</Title>
          <Table>
            <tbody>
              <tr>
                <td style={{ width: 160 }}>
                  <Text weight={500} size="sm">
                    ID Pelanggan
                  </Text>
                </td>
                <td>{elements.name}</td>
              </tr>
              <tr>
                <td style={{ width: 160 }}>
                  <Text weight={500} size="sm">
                    Nama Pelanggan
                  </Text>
                </td>
                <td>Mohamad Arif Hidayat</td>
              </tr>
            </tbody>
          </Table>
          <Title order={5}>Tagihan</Title>
          <Table>
            <tbody>
              <tr>
                <td>
                  <Text size="sm">Maret 2022</Text>
                </td>
                <td style={{ width: 100 }}>Rp. 20.000</td>
              </tr>
              <tr>
                <td>
                  <Text size="sm">Maret 2022</Text>
                </td>
                <td style={{ width: 100 }}>Rp. 20.000</td>
              </tr>
              <tr>
                <td>
                  <Text size="sm">Maret 2022</Text>
                </td>
                <td style={{ width: 100 }}>Rp. 20.000</td>
              </tr>
              <tr>
                <td className="text-right">
                  <Text size="sm" weight={500}>
                    Total
                  </Text>
                </td>
                <td>
                  <Text size="sm" weight={500}>
                    Rp. 60.000
                  </Text>
                </td>
              </tr>
            </tbody>
          </Table>
          <Select
            label="Metode Pembayaran"
            placeholder="Pilih Metode Pembayaran"
            data={[
              { value: "cash", label: "Cash" },
              { value: "ovo", label: "OVO" },
              { value: "gopay", label: "Gopay" },
            ]}
          />
          <TextInput
            label="No. Handphone"
            placeholder="No. Handphone"
            data-autofocus
          />
          <Button fullWidth onClick={() => modals.closeModal(id)} mt="md">
            Bayar
          </Button>
        </>
      ),
    });

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

      <Grid>
        <Grid.Col span={12}>
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
              </Grid.Col>
            </Grid>
          </Box>
        </Grid.Col>
        <Grid.Col sm={12} md={6}>
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
            <Group direction="column" grow spacing="lg">
              <Title order={4}>Info Pelanggan</Title>
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
          </Box>
        </Grid.Col>
        <Grid.Col sm={12} md={6}>
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
            <Group direction="column" grow spacing="lg">
              <Title order={4}>Tagihan</Title>
              <Stack spacing="xs">
                <Box
                  sx={(theme) => ({
                    padding: theme.spacing.md,
                    border: "1px solid",
                    borderColor: theme.colors.dark[2],
                    borderRadius: theme.radius.sm,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                    },
                  })}
                >
                  <SimpleGrid cols={2}>
                    <Group>
                      <Checkbox checked />
                      <div>
                        <Text weight={500}>Maret 2022</Text>
                        <Text size="sm" color="red">
                          Jatuh Tempo: 5 Maret 2022
                        </Text>
                      </div>
                    </Group>

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
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                    },
                  })}
                >
                  <SimpleGrid cols={2}>
                    <Group>
                      <Checkbox checked />
                      <div>
                        <Text weight={500}>Maret 2022</Text>
                        <Text size="sm" color="red">
                          Jatuh Tempo: 5 Maret 2022
                        </Text>
                      </div>
                    </Group>

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
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                    },
                  })}
                >
                  <SimpleGrid cols={2}>
                    <Group>
                      <Checkbox checked />
                      <div>
                        <Text weight={500}>Maret 2022</Text>
                        <Text size="sm" color="red">
                          Jatuh Tempo: 5 Maret 2022
                        </Text>
                      </div>
                    </Group>

                    <div className="text-right">
                      <Text weight={500}>Rp. 20.000</Text>
                    </div>
                  </SimpleGrid>
                </Box>
              </Stack>
              <Table>
                <tbody>
                  {/* <tr className="text-right">
                    <td>Diskon :</td>
                    <td style={{ width: "150px" }}>Rp. 0</td>
                  </tr> */}
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

              <Button type="submit" size="lg" onClick={openBayarModal}>
                Bayar
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
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
