import Layout from "@components/views/pelanggan/Layout";
import { useState } from "react";
import {
  Modal,
  Button,
  useMantineTheme,
  Card,
  List,
  Group,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { convertToRupiah } from "helpers/functions";
import Link from "next/link";
import { IconCircleCheck } from "@tabler/icons";
export const getServerSideProps = async (ctx) => {
  const option = { headers: { Cookie: ctx.req.headers.cookie } };
  const paket = await fetch(`${process.env.API_URL}/api/paket`, option).then(
    (res) => res.json()
  );
  return {
    props: {
      paket,
    },
  };
};
const Index = ({ paket }) => {
  return (
    <Layout>
      <article className="h-52 p-4 bg-white shadow-md">
        <p className="text-dimmed">Paket Anda</p>
        <span className="text-lg font-bold">Belum Berlangganan</span>

        <div className="flex mt-10 justify-between">
          <div className="tr-in">
            <p className="text-dimmed">Transaksi Masuk</p>
            <span className="text-color-primary">Rp 0</span>
          </div>
          <div className="exp">
            <p className="text-dimmed">Jatuh Tempo</p>
            <span className="text-color-primary">YYY-MM-DD</span>
          </div>
        </div>
      </article>
      <article className="grid grid-cols-1 gap-5 mt-5">
        {paket.result &&
          paket.result.map((e, k) => {
            return (
              <Card
                key={k}
                withBorder
                className="pb-10 relative"
                shadow="sm"
                p="sm"
                radius="md"
              >
                <Group position="apart">
                  <h3>{e.nama}</h3>
                  <Badge>{e.produk.nama}</Badge>
                </Group>
                {convertToRupiah(e.harga)}
                <List
                  spacing="xs"
                  size="sm"
                  p="sm"
                  icon={
                    <ThemeIcon color="teal" size={24} radius="xl">
                      <IconCircleCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  {e.fiturs.map((x, xk) => {
                    return <List.Item key={xk}>{x.fitur.nama}</List.Item>;
                  })}
                </List>
                <div className="absolute bottom-0 w-full left-0 right-0">
                  <Link href="/pelanggan">
                    <Button
                      variant="light"
                      color="blue"
                      fullWidth
                      className=""
                      mt="md"
                    >
                      Berlangganan
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
      </article>
    </Layout>
  );
};

function Demo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="This is fullscreen modal!"
        size="100%"
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        {/* Modal content */}
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  );
}
export default Index;
