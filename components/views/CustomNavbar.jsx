import { Navbar, ScrollArea, createStyles } from "@mantine/core";
import NavbarUserButton from "@components/UserButton/NavbarUserButton";
import { LinksGroup } from "@components/NavbarLinksGroup/NavbarLinksGroup";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@mantine/hooks";
import { useState, useEffect } from "react";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

const Links = ({ menu }) => {
  const [opened, setOpened] = useLocalStorage({
    key: "menu",
    defaultValue: [],
  });
  const [collapse, setCollapse] = useState([]);

  useEffect(() => {
    setCollapse(opened);
  }, [opened, setCollapse]);

  const setMenuList = (index) => {
    if (collapse.includes(index)) {
      setCollapse(collapse.filter((f) => f != index));
      setOpened(collapse.filter((f) => f != index));
    } else {
      setCollapse([...collapse, index]);
      setOpened([...collapse, index]);
    }
  };

  return (
    <>
      {menu.map((item, index) => (
        <LinksGroup
          {...item}
          key={item.label}
          setMenuList={setMenuList}
          index={index}
          collapse={collapse}
          setOpened={setOpened}
        />
      ))}
    </>
  );
};

const CustomNavbar = ({ menu, ...props }) => {
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const user = session.user;
  return (
    <Navbar {...props} className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          <Links menu={menu} />
        </div>
      </Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <NavbarUserButton user={user} />
      </Navbar.Section>
    </Navbar>
  );
};

export default CustomNavbar;
