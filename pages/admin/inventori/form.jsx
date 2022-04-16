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
function Form({ inventori, action }) {
  const form = useForm({
    initialValues: {
      kode: "",
      nama: "",
      tipe: "",
      merek: "",
      harga_beli: "",
      satuan: "",
      status: "",
    },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
      tipe: (value) => (value.length < 1 ? "Plese input tipe." : null),
      merek: (value) => (value.length < 1 ? "Plese input merek." : null),
      harga_beli: (value) =>
        value.length < 1 ? "Plese input harga beli." : null,
      satuan: (value) => (value.length < 1 ? "Plese input satuan." : null),
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
        kode: inventori.kode,
        nama: inventori.nama,
        tipe: inventori.tipe,
        merek: inventori.merek,
        satuan: inventori.satuan,
        harga_beli: inventori.harga_beli,
        status: inventori.status,
      });
      setOpened(false);
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = inventori.id ? inventori.id : 0;
      const code = generateCode("INV", parseInt(codeInt) + 1);
      form.setValues({
        kode: code,
        nama: "",
        tipe: "",
        merek: "",
        satuan: "",
        harga_beli: "",
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
      action === "edit" ? `/api/inventori/${inventori.id}` : `/api/inventori`;
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
          pathname: "/admin/inventori",
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
        <title>Master Inventori</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Inventori
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

                <Grid>
                  <Grid.Col sm={12} md={6}>
                    <TextInput
                      icon="Rp"
                      onInput={(e) => inputNumberOnly(e)}
                      label="Harga Beli"
                      description=""
                      disabled={disabled}
                      {...form.getInputProps("harga_beli")}
                      value={form.values.harga_beli}
                      onChange={(e) =>
                        form.setFieldValue("harga_beli", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col sm={12} md={6}>
                    <Select
                      label="Satuan"
                      {...form.getInputProps("satuan")}
                      onChange={(e) => form.setFieldValue("satuan", e)}
                      value={form.values.satuan}
                      data={["Meter", "Kg", "Litre", "Box", "Pcs","Unit"]}
                      placeholder="Select items"
                      nothingFound="Nothing found"
                      searchable
                      disabled={disabled}
                    />
                  </Grid.Col>
                </Grid>
              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <InputWrapper label="Tipe">
                  <TextInput
                    disabled={disabled}
                    {...form.getInputProps("tipe")}
                    value={form.values.tipe}
                    onChange={(e) =>
                      form.setFieldValue("tipe", e.currentTarget.value)
                    }
                  />
                </InputWrapper>
                <InputWrapper label="Merek">
                  <TextInput
                    disabled={disabled}
                    {...form.getInputProps("merek")}
                    value={form.values.merek}
                    onChange={(e) =>
                      form.setFieldValue("merek", e.currentTarget.value)
                    }
                  />
                </InputWrapper>
              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
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
  let inventori = {};
  let action = "add";
  if (id) {
    let res = await fetch(`${process.env.API_URL}/api/inventori/${id}`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    action = "edit";
    inventori = await res.json();
    if (res.status === 403) {
      let res = await fetch(`${process.env.API_URL}/api/inventori`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      const inventoris = await res.json();
      inventori =
        inventoris.result.length > 0 ? inventoris.result[0] : inventoris;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/inventori`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    const inventoris = await res.json();
    inventori =
      inventoris.result.length > 0 ? inventoris.result[0] : inventoris;
    action = "add";
  }
  if (read) {
    action = "read";
  }
  return {
    props: {
      action,
      inventori,
    },
  };
}
export default Form;
