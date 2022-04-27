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
  Text,
  PasswordInput,
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
    let res = await fetch(`${process.env.API_URL}/api/pelanggan/${id}`, OPTIONFETCH);
    action = "edit";
    result = await res.json();
    if (res.status != 200) {
      let res = await fetch(`${process.env.API_URL}/api/pelanggan`, OPTIONFETCH);
      const results = await res.json();
      result = results.result.length > 0 ? results.result[0] : results;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/pelanggan`, OPTIONFETCH);
    const results = await res.json();
    result = results.result.length > 0 ? results.result[0] : results;
    action = "add";
  }
  if (read) {
    action = "read";
  }
  const kecamatan = await fetch(`https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=3510`).then(async (res) => {
    const data = await res.json();
    return data.kecamatan;
  });
  const id_kecamatan = result?result.kecamatan.split("-")[0]:""
  const kelurahan = await fetch(`https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${id_kecamatan}`).then(res => res.json());
  // console.log(result?result.kelurahan:"")
  return {
    props: {
      action,
      session,
      kecamatan,
      desa: kelurahan,
      data: result,
    },
  };
}
const PATHNAME = "pelanggan";
const PAGENAME = "Pelanggan";
const Form = ({ data, action, kecamatan, desa }) => {
  const form = useForm({
    initialValues: { no_pelanggan: "", no_telp: "", nama: "", alamat: "", kecamatan: "", kelurahan: "", email: "", password: "" },
    validate: {
      password: (value) => (value.length < 1 && action=="add" ? "Plese input value." : null),
      no_telp: (value) => (value.length < 1 ? "Plese input value." : null),
      alamat: (value) => (value.length < 1 ? "Plese input value." : null),
      nama: (value) => (value.length < 1 ? "Plese input value." : null),
      email: (value) => {
        if (value.length < 1) {
          return "Plese input value.";
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          return "Invalid email address";
        }
        return null;
      }
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
      form.setValues({ no_pelanggan: data.no_pelanggan, no_telp: data.no_telp, nama: data.nama, alamat: data.alamat, kecamatan: data.kecamatan, kelurahan: data.kelurahan, email: data.email, password:''});
      setKelurahan(desa.kelurahan)
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      // const codeInt = data.id ? data.id : 0;
      const kodeDate=dateFormat(new Date(), "ddmmyy")  
      console.log(kodeDate)    
      const code = generateCode(`CUST${kodeDate}`, 0,1 );
      form.setFieldValue('no_pelanggan', code);
    }
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;
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
      body: JSON.stringify({ ...FORMDATA }),
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
  const [kelurahan, setKelurahan] = useState([]);
  const kelurahanHandler = async (e) => {
    const kode = e.split("-")[0];
    const kel = await fetch(`https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${kode}`).then(res => res.json());
    setKelurahan(kel.kelurahan);
    form.setFieldValue("kecamatan", e)
    form.setFieldValue("kelurahan", "")
  }
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
                  label="No Pelanggan"
                                 name="no_pelanggan"
                  readOnly
                  value={form.values.no_pelanggan}
                  {...form.getInputProps("no_pelanggan")}
                  onChange={(e) => { form.setFieldValue("no_pelanggan", e.target.value) }}
                />
                <TextInput
                  label="Nama"
                  readOnly={disabled} required
                  name="nama"
                  value={form.values.nama}
                  {...form.getInputProps("nama")}
                  onChange={(e) => { form.setFieldValue("nama", e.target.value) }}
                />
                <TextInput
                  label="Email"
                  readOnly={disabled}
                  name="email"
                  value={form.values.email}
                  {...form.getInputProps("email")}
                  required
                  onChange={(e) => { form.setFieldValue("email", e.target.value) }}
                />
                <TextInput
                  label="No Telp"
                  readOnly={disabled}
                  name="no_telp"
                  onKeyUp={(e) => inputNumberOnly(e)}
                  value={form.values.no_telp}
                  required
                  {...form.getInputProps("no_telp")}
                  onChange={(e) => { form.setFieldValue("no_telp", e.target.value) }}
                />
                <Select label="Kecamatan" data={[...kecamatan.map((e) => {
                  return {
                    value: `${e.id} - ${e.nama}`,
                    name: e.nama,
                    label: e.nama.toUpperCase()
                  }
                })
                ]} placeholder="Pick one" value={form.values.kecamatan}
                  searchable readOnly={disabled}
                  onChange={(e) => kelurahanHandler(e)}
                />
                <Select label="Kelurahan"
                  data={[...kelurahan.map((e) => {
                    return {
                      value: `${e.id} - ${e.nama}`,
                      name: e.nama,
                      label: e.nama.toUpperCase()
                    }
                  })
                  ]} readOnly={disabled} value={form.values.kelurahan}
                  onChange={(e) => { form.setFieldValue("kelurahan", e) }}
                  placeholder="Pick one"
                  description="Pilih kecamatan terlebih dahulu"
                  searchable
                />
                <TextInput
                  label="Alamat"
                  readOnly={disabled}
                  name="alamat"
                  value={form.values.alamat}
                  required
                  {...form.getInputProps("alamat")}
                  onChange={(e) => { form.setFieldValue("alamat", e.target.value) }}
                />
                <PasswordInput label="Password" description={action=="edit"?"Kosongkan jika tidak ingin merubah password":''} readOnly={disabled} required onChange={(e) => form.setFieldValue("password", e.target.value)} {...form.getInputProps("password")} id="pwplg" name="password" />
              </Group>
            </Grid.Col>
          </Grid>
          <div className="space-x-2 mt-10">
            <Button type="button" onClick={() => router.push(`/admin/${PATHNAME}`)} color="red">
              Back
            </Button>
            {!disabled && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Box>
      {/* <ModalView handler={{ modal, setModal }} form={form} /> */}
    </Layout>
  );
}
// const ModalView = ({ handler, form }) => {
//   const { modal, setModal } = handler;
//   const modalForm = useForm({
//     initialValues: {
//       nama: "",
//       tipe: "",
//       gaji: "",
//     }
//     , validate: {
//       nama: (value) => value.length > 0 ? undefined : "Nama harus diisi",
//       gaji: (value) => value > 0 ? undefined : "Gaji harus diisi",
//       tipe: (value) => value.length > 0 ? undefined : "Tipe harus diisi",
//     }
//   })

//   const submitHandler = async (e) => {
//     e.preventDefault()
//     if (modalForm.validate().hasErrors) return false;
//     const nama = e.target.nama.value;
//     const gaji = e.target.gaji.value;
//     const tipe = e.target.tipe.value;
//     await form.addListItem("items", { nama: nama, gaji: gaji, tipe: tipe });
//     modalForm.reset();
//     setModal(false)
//   }
//   return (
//     <Modal opened={modal} size="xs" onClose={() => setModal(false)} title="FORM INPUT ITEMS">
//       <form noValidate autoComplete="off" onSubmit={submitHandler}>
//         <TextInput label="Nama" name="nama" {...modalForm.getInputProps('nama')} required value={modalForm.values.nama} onChange={(e) => modalForm.setFieldValue("nama", e.target.value)} />
//         <TextInput label="Saldo" name="gaji" required onKeyUp={(e) => inputNumberOnly(e)} value={modalForm.values.gaji} onChange={(e) => modalForm.setFieldValue("gaji", e.target.value)} {...modalForm.getInputProps("gaji")} />
//         <Select
//           name="tipe"
//           label="Tipe" required placeholder="Pick one"
//           data={["ABSENSI", "PENDAPATAN", "POTONGAN"]}
//           value={modalForm.values.tipe}
//           onChange={(e) => modalForm.setFieldValue("tipe", e)}
//           {...modalForm.getInputProps("tipe")}
//         />
//         <div className="flex justify-end mt-3">

//           <Button type="submit" >
//             Submit
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   )
// }
export default Form;