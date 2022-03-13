import { useState } from "react";
import Link from "next/link";
import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  UnstyledButton,
  Menu,
  Avatar,
  Text,
  Divider,
} from "@mantine/core";
import { Search } from "tabler-icons-react";
import { MantineLogo } from "@components/MantineLogo";
import ThemeToggle from "@components/ThemeToggle";
import UserMenu from "@components/UserButton/UserMenu";

import { useGlobalContext } from "@components/contexts/GlobalContext";

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  userMenu: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  search: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

export default function CustomHeader({ links, ...props }) {
  const [state, dispatch] = useGlobalContext();
  const { classes, theme, cx } = useStyles();

  const user = {
    name: "Jane Spoonfighter",
    email: "janspoon@fighter.dev",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80",
  };

  const items = links.map((link) => (
    <Link key={link.label} href={link.link}>
      <a className={classes.link}>{link.label}</a>
    </Link>
  ));

  return (
    <Header {...props} className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <MantineLogo />
          <ThemeToggle />
        </Group>

        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            icon={<Search size={16} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
          />

          <UserMenu user={user} />
          <Burger
            opened={state.showSidebar}
            onClick={() => dispatch({ type: "toggle_sidebar" })}
            className={classes.burger}
            size="sm"
          />
        </Group>
      </div>
    </Header>
  );
}
