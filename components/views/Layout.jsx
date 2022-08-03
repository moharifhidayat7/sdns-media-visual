import CustomHeader from "./CustomHeader";
import CustomNavbar from "./CustomNavbar";

import { AppShell, Container, Loader } from "@mantine/core";

import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useState } from "react";
import { menu } from "./Menu";

const Layout = ({ children, session }) => {
  const [state, dispatch] = useGlobalContext();
  const [toggler, setToggler] = useState(false);

  const akses = session.user.role.akses.map((aks) => {
    if (aks.read == false && aks.write == false) {
      return {
        ...aks,
        visible: false,
      };
    }
    return {
      ...aks,
      visible: true,
    };
  });

  const menuByRole = menu.map((item) => {
    if (item.link == "/admin") {
      return item;
    }

    if (item.links && item.links.length > 0) {
      const subItem = item.links.filter((sub) =>
        akses.some((e) => e.path == sub.link && e.visible == true)
      );
      if (subItem.length > 0) {
        return {
          ...item,
          links: subItem,
        };
      }
    }

    if (akses.some((e) => e.path == item.link && e.visible == true)) {
      return item;
    }
  });
  const filteredMenu = menuByRole.filter((m) => m != undefined);

  const links = [];

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={
        <CustomNavbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!toggler}
          width={{ sm: 250, lg: 300 }}
          menu={filteredMenu}
        />
      }
      header={
        <CustomHeader
          height={70}
          p="md"
          links={links}
          toggler={{ toggler, setToggler }}
        />
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Container fluid>{children}</Container>
    </AppShell>
  );
};

export default Layout;
