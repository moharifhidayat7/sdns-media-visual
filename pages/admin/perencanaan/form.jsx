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
} from "@mantine/core";
import dateFormat from "dateformat";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { formList, useForm } from "@mantine/form";
import {
  convertToRupiah,
  generateCode,
  getTitle,
  inputNumberOnly,
} from "helpers/functions";
import { useNotifications } from "@mantine/notifications";
import { Check, Trash, X } from "tabler-icons-react";
import { getSession, useSession } from "next-auth/react";
import { DatePicker, Month } from "@mantine/dates";
import ArrayToTree from "array-to-tree";

const PATHNAME = "perencanaan";
const PAGENAME = "Perencanaan";
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
    let res = await fetch(`${process.env.API_URL}/api/kas/${id}`, OPTIONFETCH);
    action = "edit";
    result = await res.json();
    if (res.status != 200) {
      let res = await fetch(`${process.env.API_URL}/api/kas`, OPTIONFETCH);
      const results = await res.json();
      result = results.result.length > 0 ? results.result[0] : results;
      action = "add";
    }
  } else {
    let res = await fetch(`${process.env.API_URL}/api/kas`, OPTIONFETCH);
    const results = await res.json();
    result = results.result.length > 0 ? results.result[0] : results;
    action = "add";
  }
  const akun = await fetch(`${process.env.API_URL}/api/akun`, OPTIONFETCH).then(
    (res) => res.json()
  );
  if (read) {
    action = "read";
  }

  return {
    props: {
      action,
      session,
      akun: ArrayToTree(akun.result, {
        parentProperty: "parentId",
      }),
      data: result,
    },
  };
}

const Form = ({ data, action, akun }) => {
  const form = useForm({
    initialValues: {
      saldo: "",
      keterangan: "",
      akunId: "",
      createdAt: action != "add" && new Date(data.createdAt),
    },
    validate: {
      akunId: (value) => (value.length < 1 ? "Plese input value." : null),
      saldo: (value) => (value.length < 1 ? "Plese input value." : null),
      createdAt: (v) => (v == "" ? "Pilih tanggal" : null),
    },
  });
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const [options, setOptions] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    const rec = (par, res, parentKode = "", level = 0) => {
      if (par.parentId == null) {
        res.push({
          label: par.kode + " - " + par.nama,
          value: par.id.toString(),
          disabled: true,
        });
      }
      if (par.children) {
        for (let i = 0; i < par.children.length; i++) {
          const element = par.children[i];
          res.push({
            label: parentKode + element.kode + " - " + element.nama,
            value: element.id.toString(),
          });
          rec(element, res, parentKode + element.kode + ".", level + 1);
        }
      }
    };
    const a = akun.flatMap((ak) => {
      let result = [];
      rec(ak, result, ak.kode + ".");

      return result;
    });

    setOptions(a);
    if (action != "add") {
      form.setValues({
        saldo: data.saldo,
        keterangan: data.keterangan,
        akunId: data.akunId && data.akunId.toString(),
        createdAt: new Date(data.createdAt),
      });
      if (action == "read") {
        setDisabled(true);
      }
    } else {
      const codeInt = data.id ? data.id : 0;
      const code = generateCode("", parseInt(codeInt) + 1);
    }
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.validate().hasErrors) return false;

    setLoading(false);
    const FORMDATA = form.values;
    const method = action === "edit" ? "PUT" : "POST";
    const url = action === "edit" ? `/api/kas/${data.id}` : `/api/kas`;
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
        <form
          autoComplete="off"
          method="post"
          noValidate
          onSubmit={submitHandler}
        >
          <Grid>
            <Grid.Col sm={12} md={6}>
              <Group direction="column" grow spacing="lg">
                <DatePicker
                  placeholder="Pick date"
                  label="Tanggal"
                  disabled={disabled}
                  excludeDate={(date) => date < new Date()}
                  required
                  {...form.getInputProps("createdAt")}
                />
                <TextInput
                  label="Saldo"
                  disabled={disabled}
                  required
                  name="saldo"
                  onKeyUp={(e) => inputNumberOnly(e)}
                  value={form.values.saldo}
                  {...form.getInputProps("saldo")}
                  onChange={(e) => {
                    form.setFieldValue("saldo", e.target.value);
                  }}
                />
                <Select
                  data={options}
                  disabled={disabled}
                  onChange={(e) => {
                    form.setFieldValue("akunId", e.value);
                  }}
                  value={form.values.akunId}
                  required
                  label="Akun"
                  placeholder="Pick one"
                  {...form.getInputProps("akunId")}
                />
                <Textarea
                  disabled={disabled}
                  placeholder="Ketikkan sesuatu (opsional)"
                  label="Keterangan"
                  name="keterangan"
                  {...form.getInputProps("keterangan")}
                  value={form.values.keterangan}
                />
              </Group>
            </Grid.Col>
          </Grid>

          <div className="space-x-2 mt-10">
            <Button
              type="button"
              onClick={() => router.push(`/admin/${PATHNAME}`)}
              color="red"
            >
              Back
            </Button>
            {!disabled && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Box>
      <ModalView handler={{ modal, setModal }} form={form} />
    </Layout>
  );
};
const ModalView = ({ handler, form }) => {
  const { modal, setModal } = handler;
  const modalForm = useForm({
    initialValues: {
      nama: "",
      tipe: "",
      gaji: "",
    },
    validate: {
      nama: (value) => (value.length > 0 ? undefined : "Nama harus diisi"),
      gaji: (value) => (value > 0 ? undefined : "Gaji harus diisi"),
      tipe: (value) => (value.length > 0 ? undefined : "Tipe harus diisi"),
    },
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (modalForm.validate().hasErrors) return false;
    const nama = e.target.nama.value;
    const gaji = e.target.gaji.value;
    const tipe = e.target.tipe.value;
    await form.addListItem("items", { nama: nama, gaji: gaji, tipe: tipe });
    modalForm.reset();
    setModal(false);
  };
  return (
    <Modal
      opened={modal}
      size="xs"
      onClose={() => setModal(false)}
      title="FORM INPUT ITEMS"
    >
      <form noValidate autoComplete="off" onSubmit={submitHandler}>
        <TextInput
          label="Nama"
          name="nama"
          {...modalForm.getInputProps("nama")}
          required
          value={modalForm.values.nama}
          onChange={(e) => modalForm.setFieldValue("nama", e.target.value)}
        />
        <TextInput
          label="Saldo"
          name="gaji"
          required
          onKeyUp={(e) => inputNumberOnly(e)}
          value={modalForm.values.gaji}
          onChange={(e) => modalForm.setFieldValue("gaji", e.target.value)}
          {...modalForm.getInputProps("gaji")}
        />
        <Select
          name="tipe"
          label="Tipe"
          required
          placeholder="Pick one"
          data={["ABSENSI", "PENDAPATAN", "POTONGAN"]}
          value={modalForm.values.tipe}
          onChange={(e) => modalForm.setFieldValue("tipe", e)}
          {...modalForm.getInputProps("tipe")}
        />
        <div className="flex justify-end mt-3">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
};
export default Form;
