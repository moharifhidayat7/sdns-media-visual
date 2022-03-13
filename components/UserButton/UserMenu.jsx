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
import {
  ChevronDown,
  Heart,
  Star,
  Message,
  Settings,
  SwitchHorizontal,
  Logout,
  PlayerPause,
  Trash,
} from "tabler-icons-react";

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
        <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
          {user.name}
        </Text>
        <ChevronDown size={12} />
      </Group>
    </UnstyledButton>
  );
});

MenuControl.displayName = "MenuControl";

const UserMenu = ({ user }) => {
  const { classes, theme, cx } = menuStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const menuItems = [
    { label: "Liked posts", icon: <Heart size={15} />, link: "#" },
    { label: "Saved posts", icon: <Star size={15} />, link: "#" },
    { group: "Settings" },
    { label: "Account settings", icon: <Settings size={15} />, link: "#" },
    {
      label: "Change Account",
      icon: <SwitchHorizontal size={15} />,
      link: "#",
    },
    { divider: true },
    {
      color: "red",
      label: "Logout",
      icon: <Logout size={15} />,
      link: "#",
      className: classes.itemLogout,
    },
  ];

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
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      control={<MenuControl user={user} userMenuOpened={userMenuOpened} />}
    >
      {menuElements}
      {/* <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
          Liked posts
        </Menu.Item>
        <Menu.Item icon={<Star size={14} color={theme.colors.yellow[6]} />}>
          Saved posts
        </Menu.Item>
        <Menu.Item icon={<Message size={14} color={theme.colors.blue[6]} />}>
          Your comments
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
        <Menu.Item icon={<SwitchHorizontal size={14} />}>
          Change account
        </Menu.Item>
        <Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>

        <Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<PlayerPause size={14} />}>
          Pause subscription
        </Menu.Item>
        <Menu.Item color="red" icon={<Trash size={14} />}>
          Delete account
        </Menu.Item> */}
    </Menu>
  );
};

export default UserMenu;
