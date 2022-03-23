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
  Checkbox,
  Select,
  CheckboxGroup,
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
const PAGENAME = "paket";
export async function getServerSideProps(context) {
  const id = context.query.id;
  const read = context.query.read;
  let paket = [];
  let action = "add";
  const OPTIONFETCH = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  if (id) {
    let res = await fetch(`${process.env.API_URL}/api/paket/${id}`, OPTIONFETCH);
    action = "edit";
    paket = await res.json();
    if (res.status != 200) {
      let res = await fetch(`${process.env.API_URL}/api/paket`,OPTIONFETCH);
      const pakets = await res.json();
      paket = pakets.result.length > 0 ? pakets.result[0] : pakets;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/paket`,OPTIONFETCH);
    const pakets = await res.json();
    paket = pakets.result.length > 0 ? pakets.result[0] : pakets;
    action = "add";
  }

  if (read) {
    action = "read";
  }
  const fetchProduk = await fetch(`${process.env.API_URL}/api/produk?limit=9999`,OPTIONFETCH);
  const produks = await fetchProduk.json();
  const produk = produks.result.filter((item) => item.status === "ACTIVE");
  const fetchFitur = await fetch(`${process.env.API_URL}/api/fitur?limit=9999`,OPTIONFETCH);
  const fiturs = await fetchFitur.json();
  const fitur = fiturs.result.filter((item) => item.status === "ACTIVE");
  return {
    props: {
      action,
      data: { ...paket },
      produk, fitur
    },
  };
}

function Form({ data, action, produk, fitur }) {
  const form = useForm({
    initialValues: { kode: "", nama: "", harga: "", produkId: 0, fiturs: [], status: "" },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
      harga: (value) => (value.length < 1 ? "Plese input harga." : null),
      produkId: (value) => (value.length < 1 ? "Plese input produk." : null),
      fiturs: (value) => (value.length < 1 ? "Plese input fiturs." : null),
    },
  });
  const [opened, setOpened] = useState(true);
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [selectProduk, setSelectProduk] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (action != "add") {
      form.setValues({
        kode: data.kode,
        nama: data.nama,
        harga: data.harga,
        produkId: data.produkId.toString(),
        fiturs: data.fiturs.map((item) => item.fiturId.toString()),
        status: data.status,
      });
      setOpened(false);
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = data.id ? data.id : 0;
      const code = generateCode("PKG", parseInt(codeInt) + 1);
      form.setValues({
        kode: code,
        nama: "",
        harga: "",
        produkId: 0,
        fiturs: [],
        status: "INACTIVE",
      });
    }
    const selectProduks = produk.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.kode} - ${item.nama}`
      }
    })
    setSelectProduk(selectProduks);
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.validate().hasErrors) return false;
    setLoading(false);
    const FORMDATA = form.values;
    const method = action === "edit" ? "PUT" : "POST";
    const url = action === "edit" ? `/api/${PAGENAME}/${data.id}` : `/api/${PAGENAME}`;
    const notifTitle = action.charAt(0).toUpperCase() + action.slice(1);
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...FORMDATA, updatedId: 1, createdId: 1 }),
    }).then(async (res) => {
      const result = await res.json();
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: result.message,
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push({
          pathname: `/admin/${PAGENAME}`,
        });
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: result.message,
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
        <title>Master {PAGENAME}</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} {PAGENAME}
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
                  label="Harga"
                  icon={"Rp"}
                  onInput={(e) => inputNumberOnly(e)}
                  disabled={disabled}
                  {...form.getInputProps("harga")}
                  value={form.values.harga}
                  onChange={(e) =>
                    form.setFieldValue("harga", e.currentTarget.value)
                  }
                />
                <Select
                  label="Produk"
                  {...form.getInputProps("produkId")}
                  onChange={(e) => form.setFieldValue("produkId", e)}
                  defaultValue={`${form.values.produkId.toString()}`}
                  data={selectProduk}
                  placeholder="Select items"
                  nothingFound="Nothing found"
                  searchable
                  disabled={disabled}
                />
              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <CheckboxGroup
                value={form.values.fiturs}
                label="Fiturs"
                {...form.getInputProps("fiturs")}
                onChange={(e) => form.setFieldValue("fiturs", e)}
                required
              >
                {fitur.map((item) => {
                  return (
                    <Checkbox
                      disabled={disabled}
                      key={item.id}
                      label={item.nama}
                      value={`${item.id}`} radius="md"
                      size="md" />
                  )
                })}
              </CheckboxGroup>
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
            <Button type="button" onClick={() => router.push(`/admin/${PAGENAME}`)} color="red">
              Back
            </Button>
            {!disabled && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Box>
    </Layout>
  );
}

export default Form;