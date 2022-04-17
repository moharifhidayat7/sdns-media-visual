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

import { ChevronDown } from "tabler-icons-react";

import { menuItems } from "./Menu";

const menuStyles = createStyles((theme) => ({
  userMenu: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

const useStyles = createStyles((theme) => ({
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
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

const MenuControl = forwardRef(({ user, userMenuOpened, ...props }, ref) => {
  const { classes, theme, cx } = useStyles();

  return (
    <UnstyledButton
      ref={ref}
      className={cx(classes.user, {
        [classes.userActive]: userMenuOpened,
      })}
      {...props}
    >
      <Group spacing={7}>
        <Avatar alt={user.email} radius="xl" size={20} />
        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
          {user.nama}
        </Text>
        <ChevronDown size={12} />
      </Group>
    </UnstyledButton>
  );
});

MenuControl.displayName = "MenuControl";

const HeaderUserButton = ({ user }) => {
  const { classes, theme, cx } = menuStyles();
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
      className="hidden md:block"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      control={<MenuControl user={user} userMenuOpened={userMenuOpened} />}
    >
      {menuElements}
    </Menu>
  );
};

export default HeaderUserButton;
