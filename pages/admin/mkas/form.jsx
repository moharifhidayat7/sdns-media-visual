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
} from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { getSession } from "next-auth/react";
const PAGENAME = "mkas";
export async function getServerSideProps(context) {
  const id = context.query.id;
  const read = context.query.read;
  const session = await getSession(context);
  const userSession = session.user;
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
      userSession,
      data: mkas
    },
  };
}

function Form({ data, action, userSession }) {
  const form = useForm({
    initialValues: { kode: "", nama: "", status: "" },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
      kode: (value) => (value.length < 1 ? "Plese input kode." : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(action)
    if (action != "add") {
      form.setValues({
        kode: data.kode,
        nama: data.nama,
        status: data.status,
      });
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = data.id ? data.id : 0;
      const code = generateCode("PKG", parseInt(codeInt) + 1);
      form.setValues({
        kode: "",
        nama: "",
        status: "INACTIVE",
      });
    }
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
      body: JSON.stringify({ ...FORMDATA, updatedId: userSession.id, createdId: userSession.id }),
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
                  value={form.values.kode}
                  {...form.getInputProps("kode")}
                  onChange={(e) => { form.setFieldValue("kode", e.target.value) }}
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