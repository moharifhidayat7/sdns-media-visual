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
  Text,
  Select,
  ActionIcon,
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { formList, useForm } from "@mantine/form";
import { generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, Trash, X } from "tabler-icons-react";
import { getSession, useSession } from "next-auth/react";
const PAGENAME = "mkas";
export async function getServerSideProps(context) {
  const id = context.query.id;
  const read = context.query.read;
  const session = await getSession(context);
  let mkas = [];
  let action = "add";
  const OPTIONFETCH = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  if (id) {
    let res = await fetch(`${process.env.API_URL}/api/mkas/${id}`, OPTIONFETCH);
    action = "edit";
    mkas = await res.json();
    if (res.status != 200) {
      let res = await fetch(`${process.env.API_URL}/api/mkas`, OPTIONFETCH);
      const mkass = await res.json();
      mkas = mkass.result.length > 0 ? mkass.result[0] : mkass;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/mkas`, OPTIONFETCH);
    const mkass = await res.json();
    mkas = mkass.result.length > 0 ? mkass.result[0] : mkass;
    action = "add";
  }
  if (read) {
    action = "read";
  }

  return {
    props: {
      action,
      data: mkas,
      session
    },
  };
}

function Form({ data, action }) {
  const form = useForm({
    initialValues: { kode: "", nama: "", prefix: "", status: "", perkiraan: formList([]), disconnect: [] },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
      prefix: (value) => (value.length < 1 ? "Plese input value." : null),
      perkiraan: {
        nama: (value) => (value.length < 1 ? "Plese input nama." : null),
        status: (value) => (value.length < 1 ? "Plese input status." : null),
      },
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession()
  useEffect(() => {
    if (action != "add") {
      form.setValues({
        kode: data.kode,
        nama: data.nama,
        prefix: data.prefix,
        status: data.status,
        perkiraan: formList([...data.perkiraan.map((item) => ({
          nama: item.nama,
          status: item.status,
          id: item.id,
        }))]),
        disconnect: []
      });
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = data.id ? data.id : 0;
      const code = generateCode("MKS", parseInt(codeInt) + 1);
      const prefix = data.prefix ? "0" + (parseInt(data.prefix) + 2) : "01";
      form.setFieldValue("kode", code)
      form.setFieldValue("prefix", prefix)
    }
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
    if (form.values.perkiraan.length < 1) {
      notifications.showNotification({
        disallowClose: true,
        autoClose: 5000,
        title: "Validation Error",
        message: "Plese input perkiraan.",
        color: "red",
        icon: <X />,
        loading: false,
      });
      return false;
    }
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
      body: JSON.stringify({ ...FORMDATA }),
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
  const itemPerkiraan = form.values.perkiraan.map((item, index) => (
    <Group mt="xs" key={index}>
      <TextInput
        placeholder="Nama"
        required
        disabled={disabled}
        sx={{ flex: 1 }}
        {...form.getListInputProps('perkiraan', index, 'nama')}
      />
      <Select   disabled={disabled} required data={["DEBIT", "KREDIT"]} placeholder="Deb/Kre"    {...form.getListInputProps('perkiraan', index, 'status')} />
      <ActionIcon
        color="red"
        variant="hover"
        disabled={disabled}
        onClick={() => {
          if (item.id != undefined) {
            form.setFieldValue("disconnect", [...form.values.disconnect, item.id])
          }
          form.removeListItem('perkiraan', index)
        }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>
  ))
  return (
    <Layout session={session}>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Master {PAGENAME}</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} Akun Kas
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
                  {...form.getInputProps("kode")}
                  onChange={(e) => { form.setFieldValue("kode", e.target.value) }}
                />
                <TextInput
                  label="Prefix"
                  disabled={disabled}
                  name="prefix"
                  onKeyUp={(e) => inputNumberOnly(e)}
                  value={form.values.prefix}
                  {...form.getInputProps("prefix")}
                  onChange={(e) => { form.setFieldValue("prefix", e.target.value) }}
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
            <Grid.Col sm={12} md={6}>
              <InputWrapper label="Perkiraan" required>
                {itemPerkiraan.length > 0 ? itemPerkiraan : <Text color="dimmed" align="center">
                  Perkiraan Masih Kosong
                </Text>
                }
              </InputWrapper>
              {action != "read" &&
                <Button
                  type="button" className="mt-3" onClick={() => form.addListItem("perkiraan", { nama: "", status: "" })}>Tambah Perkiraan</Button>}
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