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
      email: "",
      username: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) => (value == "" ? "Masukkan Username" : null),
      password: (value) => (value.length < 1 ? "Masukkan password!" : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const onSubmit = async (values) => {
    setLoading(false);
    const method = action === "edit" ? "PUT" : "POST";
    const url = action === "edit" ? `/api/user/${produk.id}` : `/api/user`;
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
        <title>Tambah Pegawai</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Pegawai
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
              <Group direction="column" grow spacing="lg">
                <TextInput
                  placeholder="Username"
                  label="Username"
                  {...form.getInputProps("username")}
                />
                <TextInput
                  placeholder="Email"
                  label="Email"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  {...form.getInputProps("password")}
                />

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
    const res = await fetch(`${process.env.API_URL}/api/user`, {
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
      let res = await fetch(`${process.env.API_URL}/api/user/${id}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      action = "edit";
      produk = await res.json();
      if (res.status === 403) {
        let res = await fetch(`${process.env.API_URL}/api/user`, {
          headers: {
            Cookie: context.req.headers.cookie,
          },
        });
        const produks = await res.json();
        produk = produks.result.length > 0 ? produks.result[0] : produks;
        action = "add";
      }
    } else {
      let res = await fetch(`${process.env.API_URL}/api/user`, {
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
