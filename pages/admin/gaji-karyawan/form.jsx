import {
  Title,
  Box,
  Grid,
  InputWrapper,
  Group,
  Switch,
  Button,
  TextInput,
  Loader,
  Select,
  Input,
  Textarea,
  ActionIcon,
  Modal,
} from "@mantine/core";
import dateFormat from "dateformat";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { formList, useForm } from "@mantine/form";
import { convertToRupiah, generateCode, getTitle, inputNumberOnly } from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, Trash, X } from "tabler-icons-react";
import { getSession, useSession } from "next-auth/react";
import { DatePicker, Month } from "@mantine/dates";
const PATHNAME = "gaji-karyawan";
const PAGENAME = "Gaji Karyawan";
export async function getServerSideProps(context) {
  const id = context.query.id;
  const read = context.query.read;
  const session = await getSession(context);
  let result = [];
  let action = "add";
  const OPTIONFETCH = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };
  if (id) {
    let res = await fetch(`${process.env.API_URL}/api/gaji-karyawan/${id}`, OPTIONFETCH);
    action = "edit";
    result = await res.json();
    if (res.status != 200) {
      let res = await fetch(`${process.env.API_URL}/api/gaji-karyawan`, OPTIONFETCH);
      const results = await res.json();
      result = results.result.length > 0 ? results.result[0] : results;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/gaji-karyawan`, OPTIONFETCH);
    const results = await res.json();
    result = results.result.length > 0 ? results.result[0] : results;
    action = "add";
  }
  const karyawan = await fetch(`${process.env.API_URL}/api/user`, OPTIONFETCH).then(res => res.json());
  if (read) {
    action = "read";
  }

  return {
    props: {
      action,
      session,
      karyawan,
      data: result,
    },
  };
}

const Form = ({ data, action, karyawan }) => {
  const form = useForm({
    initialValues: { tanggalinput: "", karyawanId: 0, notransaksi: "", periode: "", catatan: "", items: formList([{ nama: "", gaji: 0, tipe: "" }]) },
    validate: {
      karyawanId: (value) => (value == 0 ? "Plese input value." : null),
      periode: (value) => (value.length < 1 ? "Plese input value." : null),
      tanggalinput: (value) => (value.length < 1 ? "Plese input value." : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession()
  useEffect(() => {
    if (action != "add") {
      form.setValues({
        kode: data.kode,
        nama: data.nama,
        status: data.status,
      });
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = data.id ? data.id : 0;
      const code = generateCode("", parseInt(codeInt) + 1);
      form.setValues({ tanggalinput: new Date(), karyawanId: 0, notransaksi: code, periode: new Date(), catatan: "", items: formList([{ nama: "", gaji: 0, tipe: "" }]) });
    }
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
    console.log(form.values);
    return false;
    setLoading(false);
    const FORMDATA = form.values;
    const method = action === "edit" ? "PUT" : "POST";
    const url = action === "edit" ? `/api/${PATHNAME}/${data.id}` : `/api/${PATHNAME}`;
    const notifTitle = action.charAt(0).toUpperCase() + action.slice(1);
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...FORMDATA, updatedId: userSession.id, createdId: userSession.id }),
    }).then(async (res) => {
      const result = await res.json();
      if (res.status === 200) {
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: result.message,
          color: "green",
          icon: <Check />,
          loading: false,
        });
        router.push({
          pathname: `/admin/${PATHNAME}`,
        });
      } else {
        setLoading(true);
        notifications.showNotification({
          disallowClose: true,
          autoClose: 5000,
          title: notifTitle,
          message: result.message,
          color: "red",
          icon: <X />,
          loading: false,
        });
      }
    });
  };

  return (
    <Layout session={session}>
      <div className="loader" hidden={loading}>
        <Loader size="xl" variant="bars" color="orange" />;
      </div>
      <Head>
        <title>Master {PAGENAME}</title>
      </Head>
      <Title order={2} style={{ marginBottom: "1.5rem" }}>
        {action == "read" ? "Read" : "Form"} {PAGENAME}
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
        <form autoComplete="off" method="post" noValidate onSubmit={submitHandler}>
          <Grid>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <TextInput
                  label="No Transaksi"
                  disabled={disabled}
                  name="notransaksi"
                  readOnly
                  value={form.values.notransaksi}
                  {...form.getInputProps("notransaksi")}
                  onChange={(e) => { form.setFieldValue("notransaksi", e.target.value) }}
                />
                <DatePicker
                  label="Periode"
                  required
                  name="periode"
                  disabled={disabled}
                  initialLevel="year"
                  value={form.values.periode}
                  {...form.getInputProps("periode")}
                  onChange={(e) => { form.setFieldValue("periode", e) }}
                />

              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <Select
                  searchable
                  data={[...karyawan.result.map(item => ({
                    value: item.id,
                    label: `${item.nama.toUpperCase()} - ${item.role && item.role.nama.toUpperCase()}`,
                  }))]}
                  {...form.getInputProps("karyawanId")}
                  onChange={(e) => { form.setFieldValue("karyawanId", e) }}
                  placeholder="Pick one"
                  label="Pegawai/Karyawan"
                  required
                />
                <DatePicker
                  label="Tanggal Input"
                  name="tanggalinput"
                  disabled={disabled}
                  value={form.values.tanggalinput}
                  {...form.getInputProps("tanggalinput")}
                  onChange={(e) => { form.setFieldValue("tanggalinput", e) }}
                  required
                />
              </Group>
            </Grid.Col>
            <Grid.Col>    <Button onClick={() => setModal(true)}>Tambah Item</Button></Grid.Col>
            <Grid.Col sm={12} md={4}>
              <table className="table-bordered w-full">
                <thead>
                  <tr><th colSpan={3}>ABSENSI</th></tr>
                </thead>
                <tbody>
                  {form.values.items.map((item, index) => item.tipe === "ABSENSI" && (
                    <tr key={index}>
                      <td >
                        {item.nama.toUpperCase()}
                      </td>
                      <td className="text-right">
                        Rp.{convertToRupiah(item.gaji)}
                      </td>
                      <td className="flex justify-center">
                        <ActionIcon variant="hover" color="red" onClick={() => form.removeListItem("items", index)}>
                          <Trash size={16} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="text-right">
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>Rp.{convertToRupiah(form.values.items.filter(e=>e.tipe==="ABSENSI").reduce((acc, item) =>acc + parseInt(item.gaji) , 0))}</b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Grid.Col>

            <Grid.Col sm={12} md={4}>
              <table className="table-bordered w-full">
                <thead>
                  <tr><th colSpan={3}>PENDAPATAN</th></tr>
                </thead>
                <tbody>
                  {form.values.items.map((item, index) => item.tipe === "PENDAPATAN" && (
                    <tr key={index}>
                      <td >
                        {item.nama.toUpperCase()}
                      </td>
                      <td className="text-right">
                        Rp.{convertToRupiah(item.gaji)}
                      </td>
                      <td className="flex justify-center">
                        <ActionIcon variant="hover" color="red" onClick={() => form.removeListItem("items", index)}>
                          <Trash size={16} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="text-right">
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>Rp.{convertToRupiah(form.values.items.filter(e=>e.tipe==="PENDAPATAN").reduce((acc, item) =>acc + parseInt(item.gaji) , 0))}</b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Grid.Col>
            <Grid.Col sm={12} md={4}>
              <table className="table-bordered w-full">
                <thead>
                  <tr><th colSpan={3}>POTONGAN</th></tr>
                </thead>
                <tbody>
                  {form.values.items.map((item, index) => item.tipe === "POTONGAN" && (
                    <tr key={index}>
                      <td >
                        {item.nama.toUpperCase()}
                      </td>
                      <td className="text-right">
                        Rp.{convertToRupiah(item.gaji)}
                      </td>
                      <td className="flex justify-center">
                        <ActionIcon variant="hover" color="red" onClick={() => form.removeListItem("items", index)}>
                          <Trash size={16} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="text-right">
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>Rp.{convertToRupiah(form.values.items.filter(e=>e.tipe==="POTONGAN").reduce((acc, item) =>acc + parseInt(item.gaji) , 0))}</b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Grid.Col>
          </Grid>

          <Textarea placeholder="Ketikkan sesuatu (opsional)" label="Catatan" name="catatan" {...form.getInputProps("catatan")} />
          <div className="space-x-2 mt-10">
            <Button type="button" onClick={() => router.push(`/admin/${PATHNAME}`)} color="red">
              Back
            </Button>
            {!disabled && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Box>
      <ModalView handler={{ modal, setModal }} form={form} />
    </Layout>
  );
}
const ModalView = ({ handler, form }) => {
  const { modal, setModal } = handler;
  const modalForm = useForm({
    initialValues: {
      nama: "",
      tipe: "",
      gaji: "",
    }
    , validate: {
      nama: (value) => value.length > 0 ? undefined : "Nama harus diisi",
      gaji: (value) => value > 0 ? undefined : "Gaji harus diisi",
      tipe: (value) => value.length > 0 ? undefined : "Tipe harus diisi",
    }
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    if (modalForm.validate().hasErrors) return false;
    const nama = e.target.nama.value;
    const gaji = e.target.gaji.value;
    const tipe = e.target.tipe.value;
    await form.addListItem("items", { nama: nama, gaji: gaji, tipe: tipe });
    modalForm.reset();
    setModal(false)
  }
  return (
    <Modal opened={modal} size="xs" onClose={() => setModal(false)} title="FORM INPUT ITEMS">
      <form noValidate autoComplete="off" onSubmit={submitHandler}>
        <TextInput label="Nama" name="nama" {...modalForm.getInputProps('nama')} required value={modalForm.values.nama} onChange={(e) => modalForm.setFieldValue("nama", e.target.value)} />
        <TextInput label="Saldo" name="gaji" required onKeyUp={(e) => inputNumberOnly(e)} value={modalForm.values.gaji} onChange={(e) => modalForm.setFieldValue("gaji", e.target.value)} {...modalForm.getInputProps("gaji")} />
        <Select
          name="tipe"
          label="Tipe" required placeholder="Pick one"
          data={["ABSENSI", "PENDAPATAN", "POTONGAN"]}
          value={modalForm.values.tipe}
          onChange={(e) => modalForm.setFieldValue("tipe", e)}
          {...modalForm.getInputProps("tipe")}
        />
        <div className="flex justify-end mt-3">

          <Button type="submit" >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  )
}
export default Form;