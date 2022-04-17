import Head from "next/head";
import {
  Title,
  Box,
  Button,
  Grid,
  Group,
  PasswordInput,
  Loader,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";

import { EyeOff, EyeCheck, Check, X } from "tabler-icons-react";
import Layout from "@components/views/Layout";
import { useSession, getSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const notifications = useNotifications();
  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      currentPassword: (v) =>
        v == ""
          ? "Masukkan password lama"
          : v.length < 8
          ? "Password minimal 8 karakter"
          : null,
      newPassword: (v) =>
        v == ""
          ? "Masukkan password baru"
          : v.length < 8
          ? "Password minimal 8 karakter"
          : null,
      confirmPassword: (v, vals) =>
        v !== vals.newPassword ? "Password Tidak Sama" : null,
    },
  });

  const onSubmit = async (values) => {
    setLoading(false);
    await fetch("/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then(async (res) => {
      const json = await res.json();
      setLoading(true);
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Ganti Password",
          message: "Ganti password berhasil",
          color: "green",
          icon: <Check />,
          loading: false,
        });
        signOut({ callbackUrl: "/" });
      } else {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: "Ganti Password",
          message: json.err,
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };

  return (
    <Layout session={session}>
      <Head>
        <title>Ganti Password</title>
      </Head>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Ganti Password
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
              <Group direction="column" grow spacing="lg">
                <PasswordInput
                  label="Password Lama"
                  visibilityToggleIcon={({ reveal, size }) =>
                    reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
                  }
                  {...form.getInputProps("currentPassword")}
                />
                <PasswordInput
                  label="Password Baru"
                  visibilityToggleIcon={({ reveal, size }) =>
                    reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
                  }
                  {...form.getInputProps("newPassword")}
                />
                <PasswordInput
                  label="Konfirmasi Password Baru"
                  visibilityToggleIcon={({ reveal, size }) =>
                    reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
                  }
                  {...form.getInputProps("confirmPassword")}
                />

                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    color="red"
                  >
                    Back
                  </Button>
                  <Button type="submit">Submit</Button>
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
  return {
    props: {
      session: await getSession(context),
    },
  };
}
