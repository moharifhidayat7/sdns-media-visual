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

const menu = [
  { label: "Dashboard", icon: Gauge, link: "/admin" },
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
      { label: "Paket", link: "/admin/paket" },
      { label: "Kas", link: "/admin/mkas" },
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
      { label: "Inventori Stok Masuk", link: "/admin/fakturin/form" },
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
  { label: "Settings", icon: Adjustments, link: "/settings" },
  {
    label: "Kontrol Akses",
    icon: Lock,
    links: [
      { label: "Roles", link: "/admin/role" },
      { label: "Pegawai", link: "/admin/pegawai" },
    ],
  },
];

export { menu };
