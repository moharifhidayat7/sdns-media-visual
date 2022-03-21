import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  InputWrapper,
  Title,
  Text,
  Anchor,
  LoadingOverlay,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
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
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
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

export default function Login() {
  const { classes } = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 1 ? "Masukkan password!" : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const login = await signIn("credentials", {
      ...values,
      redirect: false,
      callbackUrl: router.query.r,
    });
    if (login.ok) {
      router.push(login.url);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Login
        </Title>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ position: "relative" }}
        >
          <LoadingOverlay visible={loading} />
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            name="email"
            autoComplete="username"
            required
            {...form.getInputProps("email")}
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
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}
