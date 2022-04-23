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
      { label: "Voucher", link: "/admin/voucher" },
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
      { label: "Kas Pengeluaran & Pemasukan", link: "/kas-form" },
    ],
  },
  {
    label: "Laporan",
    icon: Report,
    links: [
      { label: "Faktur Stok Masuk", link: "/admin/faktur-stok-masuk" },
      { label: "Faktur Stok Keluar", link: "/faktur-stok-keluar" },
      { label: "Faktur Stok Opname", link: "/faktur-stok-opname" },
      { label: "Ringkasan Stok", link: "/ringkasan-stok" },
      { label: "Slip Gaji Karyawan", link: "/admin/gaji-karyawan" },
      { label: "Kas", link: "/kas" },
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
