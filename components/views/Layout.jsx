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

const Layout = ({ children }) => {
  const [state, dispatch] = useGlobalContext();
  const [toggler,setToggler]=useState(false)

  const menu = [
    { label: "Dashboard", icon: Gauge, link: "/" },
    {
      label: "Master",
      icon: BuildingCottage,
      initiallyOpened: true,
      links: [
        { label: "Produk", link: "/admin/produk" },
        { label: "Inventori", link: "/admin/inventori" },
        { label: "Suppliers", link: "/admin/supplier" },
        { label: "Gudang", link: "/admin/gudang" },
        { label: "Fitur", link: "/admin/fitur" },
        { label: "Paket", link: "/admin/paket" }
      ],
    },
    {
      label: "Notifikasi",
      icon: Notification,
      links: [
        { label: "Permintaan", link: "/" },
        { label: "Kirim Pesan", link: "/" },
      ],
    },
    {
      label: "Users Management",
      icon: Users,
      links: [
        { label: "Pelanggan Aktif", link: "/" },
        { label: "Pelanggan Non Aktif", link: "/" },
        { label: "Tagihan Pelanggan", link: "/" },
        { label: "Pembayaran Tagihan", link: "/" },
      ],
    },

    {
      label: "Instalasi",
      icon: Server,
      links: [
        { label: "Pasang Baru", link: "/" },
        { label: "Mutasi", link: "/" },
        { label: "Paralel", link: "/" },
      ],
    },
    {
      label: "Transaksi",
      icon: Receipt2,
      links: [
        { label: "Inventori Stok Masuk", link: "/" },
        { label: "Inventori Opname", link: "/" },
        { label: "Inventori Pre Order", link: "/" },
        { label: "Inventori Pengembalian", link: "/" },
        { label: "Tagihan Pelanggan", link: "/" },
        { label: "Pembayaran Tagihan", link: "/" },
      ],
    },
    {
      label: "Laporan",
      icon: Report,
      links: [
        { label: "Faktur Stok Masuk", link: "/" },
        { label: "Faktur Stok Keluar", link: "/" },
        { label: "Faktur Stok Opname", link: "/" },
        { label: "Ringkasan Stok", link: "/" },
      ],
    },
    { label: "Settings", icon: Adjustments, link: "#" },
    {
      label: "Kontrol Akses",
      icon: Lock,
      links: [
        { label: "Roles", link: "/" },
        { label: "Pegawai", link: "/admin/pegawai" },
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
          hidden={!toggler}
          width={{ sm: 250, lg: 300 }}
          menu={menu}
        />
      }
      header={<CustomHeader height={70} p="md" links={links} toggler={{toggler,setToggler}}/>}
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
