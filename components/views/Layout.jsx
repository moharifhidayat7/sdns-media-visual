import CustomHeader from "./CustomHeader";
import CustomNavbar from "./CustomNavbar";

import { AppShell, Container, Loader } from "@mantine/core";

import {
  Gauge,
  BuildingCottage,
  Receipt2,
  ReportMoney,
  Report,
  Notification,
  Server,
  Users,
  Adjustments,
  Lock,
} from "tabler-icons-react";

import { useGlobalContext } from "@components/contexts/GlobalContext";
import { useState } from "react";
import { menu } from "./Menu";

const Layout = ({ children }) => {
  const [state, dispatch] = useGlobalContext();
  const [toggler, setToggler] = useState(false);

  const links = [
    {
      link: "/about",
      label: "Features",
    },
    {
      link: "/pricing",
      label: "Pricing",
    },
    {
      link: "/learn",
      label: "Learn",
    },
    {
      link: "/community",
      label: "Community",
    },
  ];

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
          menu={menu}
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
