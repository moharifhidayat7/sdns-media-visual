import {
  Title,
  Box,
  Grid,
  Group,
  Button,
  TextInput,
  Loader,
  Text,
  NumberInput,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";

import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { Check, X, Refresh } from "tabler-icons-react";

import { useSession, getSession } from "next-auth/react";

export default function Form({ voucher }) {
  const form = useForm({
    initialValues: {
      jumlah: 1,
      expiredAt: "",
      perpanjangan: 1,
    },
    validate: {
      jumlah: (v) => (v == 0 ? "Jumlah minimal satu" : null),
      perpanjangan: (v) => (v == 0 ? "Minimal satu bulan" : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const { data: session, status } = useSession();
  const [select, setSelect] = useState("");
  const router = useRouter();

  const onSubmit = async (values) => {
    setLoading(false);
    const url = "/api/voucher";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => {
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah Voucher",
          message: "Tambah voucher berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push("/admin/voucher");
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah Voucher",
          message: "Tambah voucher gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };
  return (
    <Layout session={session}>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Tambah Voucher</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Tambah Voucher
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
        <form autoComplete="off" onSubmit={form.onSubmit(onSubmit)}>
          <Grid>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <NumberInput
                  defaultValue={1}
                  placeholder="Jumlah Voucher"
                  label="Jumlah Voucher"
                  min={1}
                  {...form.getInputProps("jumlah")}
                />
                <DatePicker
                  placeholder="Pilih Tanggal"
                  label="Tanggal Kadaluarsa"
                  {...form.getInputProps("expiredAt")}
                />
                <NumberInput
                  defaultValue={1}
                  placeholder="Bulan"
                  label="Perpanjangan (Bulan)"
                  {...form.getInputProps("perpanjangan")}
                />

                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    color="red"
                  >
                    Back
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
