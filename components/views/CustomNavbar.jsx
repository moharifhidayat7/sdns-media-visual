import { Navbar, ScrollArea, createStyles } from "@mantine/core";
import { NavbarUserButton } from "@components/UserButton/NavbarUserButton";
import { LinksGroup } from "@components/NavbarLinksGroup/NavbarLinksGroup";

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
  return (
    <>
      {menu.map((item, index) => (
        <LinksGroup {...item} key={item.label} />
      ))}
    </>
  );
};

const CustomNavbar = ({ menu, ...props }) => {
  const { classes } = useStyles();

  return (
    <Navbar {...props} className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          <Links menu={menu} />
        </div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <NavbarUserButton
          image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          name="Ann Nullpointer"
          email="anullpointer@yahoo.com"
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default CustomNavbar;
