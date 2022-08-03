import { Box } from "@mantine/core";
import {
  IconArrowLeftRight,
  IconArrowsLeftRight,
  IconHome,
  IconNotification,
  IconNotificationOff,
  IconSearch,
  IconTransferIn,
  IconUser,
} from "@tabler/icons";
import Link from "next/link";
const Layout = ({ children }) => {
  return (
    <div className="container-sm">
      <nav className="navbar-mobile">
        <img src="/mvb_icon.png" width={60} />
        <div className="navbar-action">
          <IconNotificationOff color="gray" />
          {/* <IconSearch color="gray" /> */}
        </div>
      </nav>
      <section className="content mt-20">{children}</section>
      <footer className="footer-mobile flex justify-between w-full">
        <Link href="/pelanggan">
          <a className="nav-link-item">
            <IconHome />
          </a>
        </Link>
        <Link href="/pelanggan">
          <a className="nav-link-item">
            <IconArrowsLeftRight />
          </a>
        </Link>
        <Link href="/pelanggan">
          <a className="nav-link-item">
            <IconUser />
          </a>
        </Link>
      </footer>
    </div>
  );
};
export default Layout;
