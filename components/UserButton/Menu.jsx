import { createStyles } from "@mantine/core";
import {
  Heart,
  Star,
  Key,
  Id,
  Settings,
  SwitchHorizontal,
  Logout,
} from "tabler-icons-react";
import { signOut } from "next-auth/react";

const navStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

const menuItems = [
  { group: "Akun" },
  { label: "Profil", icon: <Id size={15} />, link: "#" },
  {
    label: "Ganti Password",
    icon: <Key size={15} />,
    link: "#",
  },
  { divider: true },
  {
    color: "red",
    label: "Logout",
    icon: <Logout size={15} />,
    onClick: () => signOut({ callbackUrl: "/login" }),
  },
];

export { menuItems };
