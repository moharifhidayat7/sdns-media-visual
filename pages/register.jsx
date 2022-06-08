import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Select,
  LoadingOverlay,
  Alert,
  ScrollArea,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useNotifications } from "@mantine/notifications";
import { Check } from "tabler-icons-react";

import { getSession } from "next-auth/react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "fixed",
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
    overflow: "auto",
    height: "100%",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function Register({ kecamatan }) {
  const { classes } = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState({
    error: false,
    message: "",
  });
  const notifications = useNotifications();
  const form = useForm({
    initialValues: {
      nama: "",
      email: "",
      no_telp: "",
      kecamatan: "",
      kelurahan: "",
      alamat: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 1 ? "Masukkan password!" : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    await fetch("/api/pelanggan/pendaftaran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (res.status !== 200) {
        const data = await res.json();
        setShowError({ error: true, message: data.message });
        setLoading(false);
        return false
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Register",
          message: "Register Berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push("/login");
      }

    });


  };
  const [kelurahan, setKelurahan] = useState([]);
  const kelurahanHandler = async (e) => {
    const kode = e.split("-")[0];
    const kel = await fetch(`https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${kode}`).then(res => res.json());
    setKelurahan(kel.kelurahan);
    form.setFieldValue("kecamatan", e)
    form.setFieldValue("kelurahan", "")
  }
  return (
    <>
      <Head>
        <title style={{ textTransform: "capitalize" }}>Register</title>
      </Head>
      <div className={classes.wrapper}>
        <ScrollArea speed={0.8} style={{ height: "100%" }} scrollbarSize={6}>
          <Paper className={classes.form} radius={0} p={30}>
            <Title
              order={2}
              className={classes.title}
              align="center"
              mt="md"
              mb={50}
            >
              Register
            </Title>
            {showError.error && (
              <Alert title="Login Gagal!" color="red" className="mb-2">
                {showError.message}
              </Alert>
            )}

            <form
              onSubmit={form.onSubmit(handleSubmit)}
              style={{ position: "relative" }}
            >
              <LoadingOverlay visible={loading} />
              <TextInput
                label="Nama"
                size="md"
                mt="md"
                name="nama"
                autoComplete="username"
                required
                {...form.getInputProps("nama")}
              />
              <TextInput
                label="No Telp"
                placeholder="0823xxxxxx"
                size="md"
                mt="md"
                name="no_telp"
                autoComplete="username"
                required
                {...form.getInputProps("no_telp")}
              />
              <TextInput
                label="Email address"
                size="md"
                name="email"
                mt="md"
                autoComplete="username"
                required
                {...form.getInputProps("email")}
              />
              <Select label="Kecamatan" data={[...kecamatan.map((e) => {
                return {
                  value: `${e.id} - ${e.nama}`,
                  name: e.nama,
                  label: e.nama.toUpperCase()
                }
              })
              ]}
                mt="md" required
                placeholder="Pick one" value={form.values.kecamatan}
                searchable
                onChange={(e) => kelurahanHandler(e)}
              />

              <Select label="Kelurahan"
                data={[...kelurahan.map((e) => {
                  return {
                    value: `${e.id} - ${e.nama}`,
                    name: e.nama,
                    label: e.nama.toUpperCase()
                  }
                })
                ]} mt="md" required value={form.values.kelurahan}
                onChange={(e) => { form.setFieldValue("kelurahan", e) }}
                placeholder="Pick one"
                description="Pilih kecamatan terlebih dahulu"
                searchable
              />
              <TextInput
                label="Alamat"
                size="md"
                mt="md"
                name="alamat"
                required
                {...form.getInputProps("alamat")}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                autoComplete="off"
                required
                {...form.getInputProps("password")}
              />
              <Button fullWidth mt="xl" size="md" type="submit">
                Buat Akun
              </Button>
              <Link href="/login"><Button type="button" fullWidth mt="xl" size="md" variant="subtle"  >
                Login
              </Button>
              </Link>
            </form>
          </Paper>
        </ScrollArea>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const kecamatan = await fetch(`https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=3510`).then(async (res) => {
    const data = await res.json();
    return data.kecamatan;
  });
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };
  }

  return {
    props: {
      kecamatan,
      session: session,
    },
  };
};
