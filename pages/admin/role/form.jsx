import {
  Title,
  Box,
  Grid,
  InputWrapper,
  Input,
  Group,
  Switch,
  Button,
  CheckboxGroup,
  TextInput,
  Loader,
  Notification,
  Accordion,
  Alert,
  Table,
  SimpleGrid,
  Text,
  PasswordInput,
  Checkbox,
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { menu } from "@components/views/Menu";

import { useSession, getSession } from "next-auth/react";
function Form({ role, action }) {
  const form = useForm({
    initialValues: {
      nama: (role && role.nama) || "",
    },
    validate: {
      nama: (value) => (value == "" ? "Masukkan Nama Role" : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [akses, setAkses] = useState([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  const changeAkses = (v, path, nama) => {
    const prepData = {
      nama,
      path,
      write: v.includes("write"),
      read: v.includes("read"),
    };

    setAkses([prepData, ...akses.filter((f) => f.path != path)]);
  };

  const onSubmit = async (values) => {
    setLoading(false);
    const url = role ? `/api/role/${role.id}` : `/api/role`;

    const newAkses = role
      ? akses.map((a) => ({ ...a, roleId: role.id }))
      : akses;

    await fetch(url, {
      method: role ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        akses: newAkses,
      }),
    }).then((res) => {
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah Role",
          message: "Tambah role berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push("/admin/role");
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Tambah Role",
          message: "Tambah role gagal",
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
        <title>Tambah Role</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {role ? "Edit" : "Tambah"} Role
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
              <TextInput
                placeholder="Role"
                label="Role"
                {...form.getInputProps("nama")}
              />
              <InputWrapper
                labelElement="div"
                label="Akses"
                className="mt-2"
              ></InputWrapper>
            </Grid.Col>
          </Grid>
          <div className="mb-2">
            <Accordion multiple initialState={[1, 2, 3]}>
              {menu.map((item) => {
                if (item.link == "/admin") {
                  return;
                }
                if (item.links && item.links.length > 0) {
                  return (
                    <Accordion.Item
                      label={item.label.toUpperCase()}
                      key={item.label}
                    >
                      <Group>
                        {item.links.map((sub, i) => {
                          return (
                            <Grid grow key={sub.label}>
                              <Grid.Col>
                                <Text weight={500}>{sub.label}</Text>{" "}
                                <Text size="xs">{sub.link}</Text>
                              </Grid.Col>
                              <Grid.Col>
                                <CheckboxGroup
                                  defaultValue={
                                    role && [
                                      role.akses.some(
                                        (e) =>
                                          e.path === sub.link && e.read === true
                                      ) && "read",
                                      role.akses.some(
                                        (e) =>
                                          e.path === sub.link &&
                                          e.write === true
                                      ) && "write",
                                    ]
                                  }
                                  onChange={(v) =>
                                    changeAkses(v, sub.link, sub.label)
                                  }
                                >
                                  <Checkbox value="read" label="READ" />
                                  <Checkbox value="write" label="WRITE" />
                                </CheckboxGroup>
                              </Grid.Col>
                            </Grid>
                          );
                        })}
                      </Group>
                    </Accordion.Item>
                  );
                }
                return (
                  <Accordion.Item
                    label={item.label.toUpperCase()}
                    key={item.label}
                  >
                    <Text weight={500}>{item.label}</Text>{" "}
                    <Text size="xs">{item.link}</Text>
                    <CheckboxGroup
                      defaultValue={
                        role && [
                          role.akses.some(
                            (e) => e.path === item.link && e.read === true
                          ) && "read",
                          role.akses.some(
                            (e) => e.path === item.link && e.write === true
                          ) && "write",
                        ]
                      }
                      onChange={(v) => changeAkses(v, item.link, item.label)}
                    >
                      <Checkbox value="read" label="READ" />
                      <Checkbox value="write" label="WRITE" />
                    </CheckboxGroup>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
          <div className="space-x-2">
            <Button type="button" onClick={() => router.back()} color="red">
              Back
            </Button>
            {!disabled && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Box>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const id = context.query.id;

  if (id) {
    const role = await fetch(`${process.env.API_URL}/api/role/${id}`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }).then((res) => res.json());
    return {
      props: {
        role,
        session: await getSession(context),
      },
    };
  }
  return {
    props: {
      session: await getSession(context),
    },
  };
}
export default Form;
