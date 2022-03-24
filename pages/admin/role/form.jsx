import {
  Title,
  Box,
  Grid,
  InputWrapper,
  Input,
  Group,
  Switch,
  Button,
  TextInput,
  Loader,
  Notification,
  Alert,
  Text,
  PasswordInput,
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
function Form({ produk, action }) {
  const form = useForm({
    initialValues: {
      nama: "",
    },
    validate: {
      nama: (value) => (value == "" ? "Masukkan Nama Role" : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const onSubmit = async (values) => {
    setLoading(false);
    const method = action === "edit" ? "PUT" : "POST";
    const url = action === "edit" ? `/api/role/${produk.id}` : `/api/role`;
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => {
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah Pegawai",
          message: "Tambah pegawai berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push("/admin/pegawai");
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah Pegawai",
          message: "Tambah pegawai gagal",
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };
  return (
    <Layout>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Tambah Role</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Role
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
        <form
          autoComplete="off"
          method="post"
          onSubmit={form.onSubmit(onSubmit)}
        >
          <Grid>
            <Grid.Col sm={12} md={6}>
              <TextInput
                placeholder="Role"
                label="Role"
                {...form.getInputProps("nama")}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={12}>
              <Text weight={500}>MASTER</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Group direction="column" spacing="lg">
                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    color="red"
                  >
                    Back
                  </Button>
                  {!disabled && <Button type="submit">Submit</Button>}
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
  const id = context.query.id;
  const read = context.query.read;
  let produk = {};
  let action = "add";
  if (Array.isArray(id)) {
    const res = await fetch(`${process.env.API_URL}/api/role`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    produk = await res.json();
    produk = produk.filter((item, i) => {
      for (let i = 0; i < id.length; i++) {
        if (item.id == id[i]) {
          return item;
        }
      }
    });
  } else {
    if (id) {
      let res = await fetch(`${process.env.API_URL}/api/role/${id}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      action = "edit";
      produk = await res.json();
      if (res.status === 403) {
        let res = await fetch(`${process.env.API_URL}/api/role`, {
          headers: {
            Cookie: context.req.headers.cookie,
          },
        });
        const produks = await res.json();
        produk = produks.result.length > 0 ? produks.result[0] : produks;
        action = "add";
      }
    } else {
      let res = await fetch(`${process.env.API_URL}/api/role`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      const produks = await res.json();
      produk = produks.result.length > 0 ? produks.result[0] : produks;
      action = "add";
    }
  }
  if (read) {
    action = "read";
  }
  return {
    props: {
      action,
      produk,
    },
  };
}
export default Form;
