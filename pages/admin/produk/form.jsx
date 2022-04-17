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
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { getTitle } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

import { useSession, getSession } from "next-auth/react";
function Form({ produk, action }) {
  const form = useForm({
    initialValues: { kode: "", nama: "", status: "" },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (action != "add") {
      form.setValues({
        kode: produk.kode,
        nama: produk.nama,
        status: produk.status,
      });
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = produk.id ? produk.id : 0;
      const code = "PROD" + (parseInt(codeInt) + 1);
      form.setValues({
        kode: code,
        nama: "",
        status: "INACTIVE",
      });
    }
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
    setLoading(false);
    const data = form.values;
    const method = action === "edit" ? "PUT" : "POST";
    const url = action === "edit" ? `/api/produk/${produk.id}` : `/api/produk`;
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    }).then((res) => {
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah",
          message: "Tambah data berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push({
          pathname: "/admin/produk",
        });
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah",
          message: "Tambah data gagal",
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
        <title>Master Produk</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Produk
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
        <form autoComplete="off" method="post" onSubmit={submitHandler}>
          <Grid>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <InputWrapper label="Kode">
                  <Input
                    disabled={disabled}
                    name="kode"
                    readOnly
                    value={form.values.kode}
                  />
                </InputWrapper>
                <InputWrapper label="Nama">
                  <TextInput
                    disabled={disabled}
                    {...form.getInputProps("nama")}
                    value={form.values.nama}
                    onChange={(e) =>
                      form.setFieldValue("nama", e.currentTarget.value)
                    }
                  />
                </InputWrapper>
                <InputWrapper label="Status">
                  <Switch
                    disabled={disabled}
                    name="status"
                    checked={form.values.status === "ACTIVE"}
                    onChange={(e) =>
                      form.setFieldValue(
                        "status",
                        e.currentTarget.checked ? "ACTIVE" : "INACTIVE"
                      )
                    }
                    onLabel="ON"
                    offLabel="OFF"
                    size="lg"
                    radius="lg"
                  />
                </InputWrapper>
                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => router.push("/admin/produk")}
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
    const res = await fetch(`${process.env.API_URL}/api/produk`, {
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
      let res = await fetch(`${process.env.API_URL}/api/produk/${id}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      action = "edit";
      produk = await res.json();
      if (res.status === 403) {
        let res = await fetch(`${process.env.API_URL}/api/produk`, {
          headers: {
            Cookie: context.req.headers.cookie,
          },
        });
        const produks = await res.json();
        produk = produks.result.length > 0 ? produks.result[0] : produks;
        action = "add";
      }
    } else {
      let res = await fetch(`${process.env.API_URL}/api/produk`, {
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
      session: await getSession(context),
    },
  };
}
export default Form;
