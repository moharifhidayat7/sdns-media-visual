import Layout from "@components/views/pelanggan/Layout";
const Index = () => {
  return (
    <Layout>
      <section className="content mt-20">
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
      </section>
    </Layout>
  );
};
export default Index;
