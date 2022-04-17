import React, { forwardRef, useState } from "react";
import {
  Menu,
  Divider,
  UnstyledButton,
  Text,
  Group,
  createStyles,
  Avatar,
} from "@mantine/core";

import { ChevronDown, ChevronRight } from "tabler-icons-react";

import { menuItems } from "./Menu";

const useStyles = createStyles((theme) => ({
  body: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
  },
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

const NavbarControl = forwardRef(({ user, userMenuOpened, ...props }, ref) => {
  const { classes, theme, cx } = useStyles();

  return (
    <UnstyledButton
      ref={ref}
      className={cx(classes.user, {
        [classes.userActive]: userMenuOpened,
      })}
      {...props}
    >
      <Group>
        <Avatar radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {user.nama}
          </Text>

          <Text color="dimmed" size="xs">
            {user.email}
          </Text>
        </div>

        <ChevronRight size={14} />
      </Group>
    </UnstyledButton>
  );
});

NavbarControl.displayName = "NavbarControl";

const NavbarUserButton = ({ user }) => {
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const menuElements = menuItems.map((item, index) => {
    if (item.divider) {
      return <Divider key={index} />;
    }

    if (item.group) {
      return <Menu.Label key={index}>{item.group}</Menu.Label>;
    }

    return (
      <Menu.Item icon={item.icon} key={index} {...item}>
        {item.label}
      </Menu.Item>
    );
  });

  return (
    <Menu
      size={260}
      placement="end"
      transition="pop-top-right"
      classNames={classes}
      className="w-full"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      control={<NavbarControl user={user} userMenuOpened={userMenuOpened} />}
    >
      {menuElements}
    </Menu>
  );
};

export default NavbarUserButton;
