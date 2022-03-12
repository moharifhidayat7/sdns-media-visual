import CustomHeader from "./CustomHeader";
import CustomNavbar from "./CustomNavbar";

import { AppShell, Container } from "@mantine/core";

import {
  Gauge,
  Notes,
  CalendarStats,
  PresentationAnalytics,
  FileAnalytics,
  Adjustments,
  Lock,
} from "tabler-icons-react";

import { useGlobalContext } from "@components/contexts/GlobalContext";

const Layout = ({ children }) => {
  const [state, dispatch] = useGlobalContext();

  const menu = [
    { label: "Dashboard", icon: Gauge, link: "/Dashboard" },
    {
      label: "Market news",
      icon: Notes,
      initiallyOpened: true,
      links: [
        { label: "Overview", link: "/" },
        { label: "Forecasts", link: "/" },
        { label: "Outlook", link: "/" },
        { label: "Real time", link: "/" },
      ],
    },
    {
      label: "Releases",
      icon: CalendarStats,
      links: [
        { label: "Upcoming releases", link: "/" },
        { label: "Previous releases", link: "/" },
        { label: "Releases schedule", link: "/" },
      ],
    },
    { label: "Analytics", icon: PresentationAnalytics, link: "#" },
    { label: "Contracts", icon: FileAnalytics, link: "#" },
    { label: "Settings", icon: Adjustments, link: "#" },
    {
      label: "Security",
      icon: Lock,
      links: [
        { label: "Enable 2FA", link: "/" },
        { label: "Change password", link: "/" },
        { label: "Recovery codes", link: "/" },
      ],
    },
  ];

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
          hidden={!state.showSidebar}
          width={{ sm: 250, lg: 300 }}
          menu={menu}
        />
      }
      header={<CustomHeader height={70} p="md" links={links} />}
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
