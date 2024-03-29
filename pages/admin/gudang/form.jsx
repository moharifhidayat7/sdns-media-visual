import {
  Title,
  Box,
  Grid,
  InputWrapper,
  Group,
  Switch,
  Button,
  TextInput,
  Loader,
  Tooltip,
  Select,
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useSession, getSession } from "next-auth/react";
function Form({ gudang, action }) {
  const form = useForm({
    initialValues: { kode: "", nama: "", status: "" },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
    },
  });
  const [opened, setOpened] = useState(true);
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (action != "add") {
      form.setValues({
        kode: gudang.kode,
        nama: gudang.nama,
        status: gudang.status,
      });
      setOpened(false);
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = gudang.id ? gudang.id : 0;
      const code = generateCode("WRH", parseInt(codeInt) + 1);
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
    const url = action === "edit" ? `/api/gudang/${gudang.id}` : `/api/gudang`;
    const notifTitle = action.charAt(0).toUpperCase() + action.slice(1);
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, updatedId: 1, createdId: 1 }),
    }).then((res) => {
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: `${notifTitle} data berhasil`,
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push({
          pathname: "/admin/gudang",
        });
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: `${notifTitle} data gagal`,
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
        <title>Master Gudang</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Gudang
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
                <TextInput
                  label="Kode"
                  disabled={disabled}
                  name="kode"
                  readOnly
                  value={form.values.kode}
                />
                <TextInput
                  label="Nama"
                  disabled={disabled}
                  {...form.getInputProps("nama")}
                  value={form.values.nama}
                  onChange={(e) =>
                    form.setFieldValue("nama", e.currentTarget.value)
                  }
                />
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
              </Group>
            </Grid.Col>
          </Grid>
          <div className="space-x-2 mt-10">
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
  const read = context.query.read;
  let gudang = {};
  let action = "add";
  if (id) {
    let res = await fetch(`${process.env.API_URL}/api/gudang/${id}`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    action = "edit";
    gudang = await res.json();
    if (res.status === 403) {
      let res = await fetch(`${process.env.API_URL}/api/gudang`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      const gudangs = await res.json();
      gudang = gudangs.result.length > 0 ? gudangs.result[0] : gudangs;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/gudang`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    const gudangs = await res.json();
    gudang = gudangs.result.length > 0 ? gudangs.result[0] : gudangs;
    action = "add";
  }
  if (read) {
    action = "read";
  }
  return {
    props: {
      action,
      gudang,
      session: await getSession(context),
    },
  };
}
export default Form;
