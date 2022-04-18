import {
  Title,
  Box,
  Grid,
  Input,
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
import { generateCode, inputNumberOnly, ucFirst } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, Trash, X } from "tabler-icons-react";
import { getSession, useSession } from "next-auth/react";

function Form({ suppliers, gudangs, inventories, stokmasuk }) {
  const { data: session, status } = useSession();
  const form = useForm({
    initialValues: {
      faktur: "",
      supplierId: "",
      tanggalinput: new Date(),
      nomortransaksi: 0,
      keterangan: "",
    },
    validate: {
      tanggalinput: (value) =>
        value.length < 1 ? "Plese input tanggal." : null,
      supplierId: (value) =>
        value.length < 1 ? "Plese input supplier." : null,
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
          return { value: `${item.id.toString()}`, label: item.nama };
        })
      );
    }
    const kode = stokmasuk.result[0] ? stokmasuk.result[0].id : 0;
    form.setFieldValue("nomortransaksi", generateCode("", parseInt(kode) + 1));
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
    setItems([...items, { ...e, gudang: [] }]);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
    if (items.length < 1) {
      notifications.showNotification({
        disallowClose: true,
        autoClose: 5000,
        title: "Gagal",
        message: `Item tidak boleh kosong`,
        color: "red",
        icon: <X />,
        loading: false,
      });
      return false;
    }
    console.log(items)
    //add faktur stok masuk
    const postStokMasuk = await fetch("/api/stokmasuk", {
      method: "POST",
      body: JSON.stringify({
        ...form.values,
        supplierId: parseInt(form.values.supplierId),
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (postStokMasuk.status != 200) {
      notifications.showNotification({
        disallowClose: true,
        autoClose: 5000,
        title: "Gagal",
        message: `${postStokMasuk.statusText}`,
        color: "red",
        icon: <X />,
        loading: false,
      });
      return false;
    }

    //add faktur stok masuk items
    const postStokMasukResult = await postStokMasuk.json();
    const dataItems = [];
    items.map((item, k) => {
      item.gudang.map((gd) => {
        dataItems.push({
          fakturStokMasukId: postStokMasukResult.FakturStokMasuk.id,
          gudangId: gd.id,
          inventoriId: item.id,
          stok: gd.qty,
          harga: item.hargabaru ? item.hargabaru.toString() : item.harga_beli.toString(),
        })
      })
    })
    const postStokMasukItems = await fetch("/api/stokmasukitem", {
      method: "POST",
      body: JSON.stringify(dataItems),
      headers: { "Content-Type": "application/json" },
    });
    if (postStokMasukItems.status != 200) {
      notifications.showNotification({
        disallowClose: true,
        autoClose: 5000,
        title: "Gagal",
        message: `${postStokMasuk.statusText}`,
        color: "red",
        icon: <X />,
        loading: false,
      });
      return false;
    }
    const postLogStok = await fetch("/api/logstok", {
      method: "POST",
      body: JSON.stringify(dataItems),
      headers: {
        "Content-Type": "application/json"
      }
    })
    // setLoading(false);
    // const data = form.values;
    // const method = action === "edit" ? "PUT" : "POST";
    // const url = `/api/fakturin`;
    // const notifTitle = action.charAt(0).toUpperCase() + action.slice(1);
    // await fetch(url, {
    //   method,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ...data, updatedId: 1, createdId: 1 }),
    // }).then((res) => {
    //   if (res.status === 200) {
    //     notifications.showNotification({
    //       disallowClose: true,
    //       autoClose: 5000,
    //       title: notifTitle,
    //       message: `${notifTitle} data berhasil`,
    //       color: "green",
    //       icon: <Check />,
    //       loading: false,
    //     });
    //     router.push({
    //       pathname: "/admin/gudang",
    //     });
    //   } else {
    //     setLoading(true);
    //     notifications.showNotification({
    //       disallowClose: true,
    //       autoClose: 5000,
    //       title: notifTitle,
    //       message: `${notifTitle} data gagal`,
    //       color: "red",
    //       icon: <X />,
    //       loading: false,
    //     });
    //   }
    // });
  };
  return (
    <Layout session={session}>
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
                  value={form.values.nomortransaksi}
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
                  value={form.values.supplierId}
                  disabled={disabled}
                />
                <Button onClick={() => setModal(true)} type="button">
                  ITEM
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <TextInput
                  label="Faktur"
                  {...form.getInputProps("faktur")}
                  name="faktur"
                  onChange={(e) => form.setFieldValue("faktur", e)}
                  value={form.values.faktur}
                />
                <DatePicker
                  allowFreeInput
                  placeholder="Pick date"
                  label="Tanggal Input"
                  onChange={(e) => form.setFieldValue("tanggalinput", e)}
                  required
                  value={form.values.tanggalinput}
                />
              </Group>
            </Grid.Col>
          </Grid>
          <div className="overflow-x-auto mt-5">
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
                  <th>harga beli</th>
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
                        set={{ items, setItems }}
                        gudangs={gudangs}
                        deleteItems={(e) =>
                          setItems([...items.filter((x) => x.id != e)])
                        }
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4 + gudangs.total * 2} className="text-center">
                      Belum ada item yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Textarea
            placeholder="Tuliskan sesuatu untuk stok masuk ini (opsional)."
            className="mt-4"
            name="keterangan"
            onChange={(e) => form.setFieldValue("keterangan", e.target.value)}
            value={form.values.keterangan}
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
              label: `${item.kode} - ${item.nama.toUpperCase()}`,
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
export const Items = ({ items, gudangs, deleteItems = () => { }, set }) => {
  const handleChange = (e, gudang) => {
    const value = e.target.value || items.stok;
    const name = e.target.name;
    if (name != "qty") {
      set.setItems([
        ...set.items.map((x) => {
          if (x.id == items.id) {
            return { ...x, hargabaru: value };
          }
          return x;
        }),
      ]);
      return false;
    }
    set.items.filter((e) => {
      if (e.id == items.id) {
        if (!e["gudang"]) {
          e["gudang"] = [
            {
              id: gudang,
              qty: value,
            },
          ];
          return e;
        }
        const hasGudang = e["gudang"].filter((x) => {
          if (x.id == gudang) {
            return x;
          }
        });
        if (hasGudang.length < 1) {
          name = value;
          e["gudang"].push({
            id: gudang,
            qty: value,
          });
        } else {
          hasGudang[0].qty = value;
        }

        const stokfinal = items.gudang.length > 1 ? items.gudang.reduce((y, x) => {
          return parseInt(y.qty) + parseInt(x.qty);
        }) : value;
        // items.stokfinal=stokfinal
        set.setItems(set.items.filter((x) => {
          if (x.id == items.id) {
            x.stokfinal = stokfinal
            return x
          }
          return x
        }));
        return e;
      }
    });

  };

  return (
    <tr>
      <td className="capitalize">
        {items.kode} - {items.nama.toUpperCase()} {items.tipe.toUpperCase()}
      </td>

      {gudangs.result &&
        gudangs.result.map((item) => {
          return [
            <td key={item.id} style={{ minWidth: "50px", textAlign: "center" }}>
              {items.stok}
            </td>,
            <td
              key={`s${item.id}`}
              className="text-center"
              style={{ minWidth: "100px" }}
            >
              <Input
                type="text"
                name="qty"
                onInput={(e) => inputNumberOnly(e)}
                placeholder="0"
                size="xs"
                rightSection={
                  <div className="text-gray-400 text-right w-full pr-1 overflow-hidden">
                    {items.satuan.toUpperCase()}
                  </div>
                }
                onChange={(e) => handleChange(e, item.id)}
              />
            </td>,
          ];
        })}
      <td className="text-center">
        <Input
          type="text"
          name="newharga"
          onInput={(e) => inputNumberOnly(e)}
          onChange={(e) => handleChange(e)}
          size="xs"
          icon="Rp"
          rightSectionWidth="60px"
          placeholder={items.harga_beli}
        />
      </td>
      <td className="text-center">{items.stokfinal}</td>

      <td>
        <div className=" flex justify-center">

          <ActionIcon
            variant="filled"
            color="red"
            onClick={() => deleteItems(items.id)}
          >

            <Trash />
          </ActionIcon>
        </div>
      </td>
    </tr>
  );
};
export const getServerSideProps = async (context) => {
  const header = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  const stokmasuk = await fetch(
    `${process.env.API_URL}/api/stokmasuk`,
    header
  ).then((res) => res.json());
  const suppliers = await fetch(
    `${process.env.API_URL}/api/supplier`,
    header
  ).then((res) => res.json());
  const gudangs = await fetch(`${process.env.API_URL}/api/gudang`, header).then(
    (res) => res.json()
  );
  const session = await getSession(context)
  const inventories = await fetch(
    `${process.env.API_URL}/api/inventori`,
    header
  ).then((res) => res.json());
  return {
    props: {
      suppliers,
      gudangs,
      inventories,
      session,
      stokmasuk: stokmasuk,
    },
  };
};
export default Form;
