import {
  Gauge,
  BuildingCottage,
  Receipt2,
  ReportMoney,
  CreditCard,
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
    initiallyOpened: false,
    links: [
      { label: "Produk", link: "/admin/produk" },
      { label: "Inventori", link: "/admin/inventori" },
      { label: "Suppliers", link: "/admin/supplier" },
      { label: "Gudang", link: "/admin/gudang" },
      { label: "Fitur", link: "/admin/fitur" },
      { label: "Paket", link: "/admin/paket" },
      { label: "Akun", link: "/admin/akun" },
      { label: "Voucher", link: "/admin/voucher" },
      { label: "Pelanggan", link: "/admin/pelanggan" },
    ],
  },
  {
    label: "Notifikasi",
    icon: Notification,
    links: [
      { label: "Permintaan", link: "/permintaan" },
      { label: "Kirim Pesan", link: "/kirim-pesan" },
    ],
  },
  {
    label: "Users Management",
    icon: Users,
    links: [
      { label: "Pelanggan Aktif", link: "/pelanggan-aktif" },
      { label: "Pelanggan Non Aktif", link: "/pelanggan-nonaktif" },
      { label: "Tagihan Pelanggan", link: "/tagihan" },
      { label: "Pembayaran Tagihan", link: "/pembayaran" },
    ],
  },

  {
    label: "Instalasi",
    icon: Server,
    links: [
      { label: "Pasang Baru", link: "/pasang-baru" },
      { label: "Mutasi", link: "/mutasi" },
      { label: "Paralel", link: "/paralel" },
    ],
  },
  {
    label: "Transaksi",
    icon: Receipt2,
    links: [
      { label: "Inventori Stok Masuk", link: "/admin/faktur-stok-masuk/form" },
      { label: "Inventori Opname", link: "/opname" },
      { label: "Inventori Pre Order", link: "/preorder" },
      { label: "Inventori Pengembalian", link: "/pengembalian" },
      { label: "Pembayaran Gaji Karyawan", link: "/admin/gaji-karyawan/form" },
      { label: "Tagihan Pelanggan", link: "/tagihan-pelanggan" },
    ],
  },
  {
    label: "Akunting",
    icon: CreditCard,
    links: [
      { label: "Kas", link: "/admin/kas" },
      { label: "Perencanaan Kas", link: "/admin/perencanaan" },
    ],
  },
  {
    label: "Laporan",
    icon: Report,
    links: [
      { label: "Laporan Kas", link: "/admin/laporan/kas" },
      { label: "Faktur Stok Masuk", link: "/admin/faktur-stok-masuk" },
      { label: "Faktur Stok Keluar", link: "/faktur-stok-keluar" },
      { label: "Faktur Stok Opname", link: "/faktur-stok-opname" },
      { label: "Ringkasan Stok", link: "/ringkasan-stok" },
      { label: "Slip Gaji Karyawan", link: "/admin/gaji-karyawan" },
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
const menuPelanngan = [{ label: "Dashboard", icon: Gauge, link: "/pelanggan" }];
export { menu, menuPelanngan };
