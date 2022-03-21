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
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Mail, Check, X } from "tabler-icons-react";
function Form({ supplier, action }) {
  const form = useForm({
    initialValues: {
      kode: "",
      nama: "",
      email: "",
      alamat: "",
      no_telphone: "",
      whatsapp: "",
      status: "",
    },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
      alamat: (value) => (value.length < 1 ? "Plese input alamat." : null),
      no_telphone: (value) =>
        value.length < 1 ? "Plese input no telphone." : null,
    },
  });
  const [opened, setOpened] = useState(true);
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (action != "add") {
      form.setValues({
        kode: supplier.kode,
        nama: supplier.nama,
        email: supplier.email,
        no_telphone: supplier.no_telphone,
        whatsapp: supplier.whatsapp,
        alamat: supplier.alamat,
        status: supplier.status,
      });
      setOpened(false);
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = supplier.id ? supplier.id : 0;
      const code = generateCode("SUP", parseInt(codeInt) + 1);
      form.setValues({
        kode: code,
        nama: "",
        email: "",
        no_telphone: "",
        alamat: "",
        whatsapp: "",
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
    const url =
      action === "edit" ? `/api/supplier/${supplier.id}` : `/api/supplier`;
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
          pathname: "/admin/supplier",
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
    <Layout>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Master Supplier</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Supplier
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
                <TextInput
                  icon={<Mail />}
                  label="Email"
                  disabled={disabled}
                  {...form.getInputProps("email")}
                  value={form.values.email}
                  onChange={(e) =>
                    form.setFieldValue("email", e.currentTarget.value)
                  }
                />
                <TextInput
                  label="No Telphone"
                  disabled={disabled}
                  {...form.getInputProps("no_telphone")}
                  value={form.values.no_telphone}
                  onChange={(e) =>
                    form.setFieldValue("no_telphone", e.currentTarget.value)
                  }
                />
                <TextInput
                  label="WhatsApp"
                  disabled={disabled}
                  {...form.getInputProps("whatsapp")}
                  value={form.values.whatsapp}
                  onChange={(e) =>
                    form.setFieldValue("whatsapp", e.currentTarget.value)
                  }
                />
                <TextInput
                  label="Alamat"
                  disabled={disabled}
                  {...form.getInputProps("alamat")}
                  value={form.values.alamat}
                  onChange={(e) =>
                    form.setFieldValue("alamat", e.currentTarget.value)
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
            <Button
              type="button"
              onClick={() => router.push("/admin/supplier")}
              color="red"
            >
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
  let supplier = [];
  let action = "add";
  if (id) {
    let res = await fetch(`${process.env.API_URL}/api/supplier/${id}`);
    action = "edit";
    supplier = await res.json();
    if (res.status === 403) {
      let res = await fetch(`${process.env.API_URL}/api/supplier`);
      const suppliers = await res.json();
      supplier = suppliers.result.length > 0 ? suppliers.result[0] : suppliers;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/supplier`);
    const suppliers = await res.json();
    supplier = suppliers.result.length > 0 ? suppliers.result[0] : suppliers;
    action = "add";
  }
  if (read) {
    action = "read";
  }
  return {
    props: {
      action,
      supplier,
    },
  };
}
export default Form;
