import {
  Title,
  Box,
  Grid,
  Group,
  Button,
  TextInput,
  Select,
  Loader,
  ActionIcon,
  Textarea,
  Modal,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, Edit, EditCircle, Trash, X } from "tabler-icons-react";
function Form({ suppliers, gudangs, inventories }) {
  const form = useForm({
    initialValues: {
      faktur: "",
      supplierId: "",
      tanggalinput: "",
      nomorinput: "",
    },
    validate: {
      nama: (value) => (value.length < 1 ? "Plese input nama." : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [dataSupplier, setDataSupplier] = useState([]);
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (suppliers.result) {
      setDataSupplier(
        suppliers.result.map((item) => {
          return { value: item.id, label: item.nama };
        })
      );
    }

    form.setValues({
      nomorinput: "00001",
    });
  }, []);
  const handleItem = (e) => {
    const newItems = items.filter((x) => x.id === e.id);
    if (newItems.length > 0) {
      notifications.showNotification({
        disallowClose: true,
        autoClose: 5000,
        title: "Tambah Item",
        message: `Item sudah ada`,
        color: "red",
        icon: <X />,
        loading: false,
      });
      return false;
    }
    setItems([...items, { ...e }]);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
    setLoading(false);
    const data = form.values;
    const method = action === "edit" ? "PUT" : "POST";
    const url = `/api/fakturin`;
    const notifTitle = action.charAt(0).toUpperCase() + action.slice(1);
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, updatedId: 1, createdId: 1 }),
    }).then((res) => {
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: `${notifTitle} data berhasil`,
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push({
          pathname: "/admin/gudang",
        });
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: `${notifTitle} data gagal`,
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };
  return (
    <Layout>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Transaksi Stok Masuk</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        Transaksi Stok Masuk
      </Title>
      <Box
        sx={(theme) => ({
          border: "1px solid",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        <form
          autoComplete="off"
          method="post"
          onSubmit={submitHandler}
          noValidate
        >
          <Grid>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <TextInput
                  label="Nomor Transaksi"
                  disabled={disabled}
                  name="nomortransaksi"
                  readOnly
                  required
                  value={form.values.nomorinput}
                />
                <Select
                  required
                  label="Supplier"
                  {...form.getInputProps("supplierId")}
                  onChange={(e) => form.setFieldValue("supplierId", e)}
                  data={dataSupplier}
                  placeholder="Select items"
                  nothingFound="Nothing found"
                  searchable
                  disabled={disabled}
                />
                <Button onClick={() => setModal(true)} type="button">
                  ITEM
                </Button>
                <div className="overflow-x-auto">
                  <table className="table-bordered w-full">
                    <thead className="text-blue-600 uppercase">
                      <tr>
                        <th>INVENTORI</th>
                        {gudangs.result &&
                          gudangs.result.map((item) => {
                            return (
                              <th colSpan={2} key={item.id}>
                                {item.nama}
                              </th>
                            );
                          })}
                        <th>STOK FINAL</th>
                        <th>hapus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length > 0 ? (
                        items.map((item) => {
                          return (
                            <Items
                              key={item.id}
                              items={item}
                              gudangs={gudangs}
                            />
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5 + gudangs.total}
                            className="text-center"
                          >
                            Belum ada item yang dipilih.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <TextInput
                  label="Faktur"
                  disabled={disabled}
                  name="faktur"
                  value={form.values.faktur}
                />
                <DatePicker
                  allowFreeInput
                  placeholder="Pick date"
                  label="Tanggal Input"
                  required
                  value={new Date()}
                />
              </Group>
            </Grid.Col>
          </Grid>
          <Textarea
            placeholder="Tuliskan sesuatu untuk stok masuk ini (opsional)."
            className="mt-4"
          ></Textarea>
          <div className="space-x-2 mt-10">
            <Button type="button" onClick={() => router.back()} color="red">
              Back
            </Button>
            {!disabled && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Box>
      <ViewModal
        modal={{ modal, setModal }}
        inventories={inventories.result ?? inventories.result}
        handleItem={handleItem}
      />
    </Layout>
  );
}
const ViewModal = ({ modal, inventories, handleItem }) => {
  // const [data, setData] = useState([])
  const form = useForm({
    initialValues: { inventori: "" },
    validate: {
      inventori: (value) =>
        value.length < 1 ? "Harus pilih salah satu." : null,
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
    const id = form.values.inventori;
    const inventori = inventories.filter((x) => x.id == id);
    handleItem(inventori[0]);
  };

  return (
    <Modal
      opened={modal.modal}
      onClose={() => {
        modal.setModal(false);
        form.reset();
      }}
      size="sm"
      transition="rotate-left"
      title={<div className="uppercase">PILIH INVENTORI</div>}
    >
      <form noValidate onSubmit={handleSubmit}>
        <Select
          onChange={(e) => form.setFieldValue("inventori", e)}
          required
          data={inventories.map((item) => {
            return {
              value: `${item.id.toString()}`,
              label: `${item.kode} - ${item.nama}`,
            };
          })}
          placeholder="Select items"
          nothingFound="Nothing found"
          searchable
          {...form.getInputProps("inventori")}
        />
        <Button
          type="submit"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          className="mt-5"
        >
          ADD
        </Button>
      </form>
    </Modal>
  );
};
const Items = ({ items, gudangs }) => {
  return (
    <tr>
      <td>{items.nama}</td>
      {gudangs.result &&
        gudangs.result.map((item) => {
          return (
            <>
              <td key={item.id} className="w-12 text-center">
                {items.stok}
              </td>
              <td className="flex justify-center">
                <input
                  type="text"
                  onInput={(e) => inputNumberOnly(e)}
                  className="input-border-none bg-gray-100 w-20 p-2 rounded-sm"
                  placeholder="qty"
                />
              </td>
            </>
          );
        })}
      <td className="text-center">{items.stok}</td>

      <td>
        <div className=" flex justify-center">
          {" "}
          <ActionIcon variant="filled" color="red">
            {" "}
            <Trash />{" "}
          </ActionIcon>
        </div>
      </td>
    </tr>
  );
};
export async function getServerSideProps(context) {
  const header = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };

  const suppliers = await fetch(
    `${process.env.API_URL}/api/supplier`,
    header
  ).then((res) => res.json());
  const gudangs = await fetch(`${process.env.API_URL}/api/gudang`, header).then(
    (res) => res.json()
  );
  const inventories = await fetch(
    `${process.env.API_URL}/api/inventori`,
    header
  ).then((res) => res.json());
  return {
    props: {
      suppliers,
      gudangs,
      inventories,
    },
  };
}
export default Form;
