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
  Text,
  Select,
  ActionIcon,
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { Check, X, Refresh } from "tabler-icons-react";
import { generateString } from "../../../helpers/functions";

import { useSession, getSession } from "next-auth/react";
function Form({ user, role, action }) {
  const form = useForm({
    initialValues: {
      nama: user.nama || "",
      email: user.email || "",
      telepon: user.telepon || "",
      roleId: (user.roleId && user.roleId.toString()) || "1",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      roleId: (value) => (value == "" ? "Pilih Role" : null),
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
    const url = user.id ? `/api/user/${user.id}` : `/api/user`;
    await fetch(url, {
      method: user.id ? "PUT" : "POST",
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
    <Layout session={session}>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>
          {action == "read" ? "Detail" : user.id ? "Edit" : "Tambah"} Pegawai
        </title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Detail" : user.id ? "Edit" : "Tambah"} Pegawai
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
                  placeholder="Nama"
                  label="Nama"
                  disabled={action == "read"}
                  {...form.getInputProps("nama")}
                />
                <TextInput
                  placeholder="Email"
                  label="Email"
                  disabled={action == "read"}
                  {...form.getInputProps("email")}
                />
                {!user.id && (
                  <PasswordInput
                    required
                    label={
                      <div className="inline-flex space-x-2 items-center">
                        <Text weight={500} size="sm">
                          Password
                        </Text>
                        <Button
                          compact
                          variant="default"
                          size="xs"
                          leftIcon={<Refresh size={15} />}
                          onClick={() => {
                            const password = generateString(6);

                            form.setFieldValue("password", password);
                          }}
                        >
                          Random
                        </Button>
                      </div>
                    }
                    {...form.getInputProps("password")}
                  />
                )}

                <TextInput
                  placeholder="No. Telepon"
                  label="No. Telepon"
                  disabled={action == "read"}
                  {...form.getInputProps("telepon")}
                />
                <Select
                  label="Role"
                  value={select}
                  onChange={setSelect}
                  disabled={action == "read"}
                  data={role.result.map((r) => ({
                    value: r.id.toString(),
                    label: r.nama.toUpperCase(),
                  }))}
                  {...form.getInputProps("roleId")}
                />

                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    color="red"
                  >
                    Back
                  </Button>
                  {action != "read" && <Button type="submit">Submit</Button>}
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

  const role = await fetch(`${process.env.API_URL}/api/role?limit=0`, {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  }).then((res) => res.json());

  if (id) {
    const user = await fetch(`${process.env.API_URL}/api/user/${id}`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }).then((res) => res.json());
    if (context.query.readOnly != undefined) {
      return {
        props: {
          user,
          role,
          action: "read",
          session: await getSession(context),
        },
      };
    }

    return {
      props: {
        user,
        role,
        action: "",
        session: await getSession(context),
      },
    };
  }

  return {
    props: {
      user: {},
      role,
      action: "",
      session: await getSession(context),
    },
  };
}
export default Form;
