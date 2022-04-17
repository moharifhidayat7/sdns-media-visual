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
import { useSession, getSession } from "next-auth/react";

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

export default function CustomHeader({ links, toggler, ...props }) {
  const [state, dispatch] = useGlobalContext();
  const { classes, theme, cx } = useStyles();
  const { data: session, status } = useSession();

  const user = session.user;

  const items = links.map((link) => (
    <Link key={link.label} href={link.link}>
      <a className={classes.link}>{link.label}</a>
    </Link>
  ));

  return (
    <Header {...props} className={classes.header}>
      <div className={classes.inner}>
        <Group>
          {/* <MantineLogo /> */}
          <div className="font-medium text-xl">MVB</div>
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
            opened={toggler.toggler}
            onClick={() => toggler.setToggler(!toggler.toggler)}
            className={classes.burger}
            size="sm"
          />
        </Group>
      </div>
    </Header>
  );
}
