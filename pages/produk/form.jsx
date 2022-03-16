import { Title, Box, Grid, InputWrapper, Input, Group, Switch, Button, TextInput, Loader, Notification, Alert } from "@mantine/core";
import Head from "next/head";
import Layout from "@components/views/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";

function Form({ produk, action }) {
   const form = useForm({
      initialValues: { kode: '', nama: "", status: "" }, validate: {
         nama: (value) => (value.length < 1 ? 'Plese input nama.' : null),
      }
   });
   const [loading, setLoading] = useState(true);
   const router = useRouter();
   useEffect(() => {
      if (action === "edit") {
         form.setValues({
            kode: produk.kode,
            nama: produk.nama,
            status: produk.status
         })
      } else {
         const codeInt = produk.id ? produk.id : 0;
         const code = "PROD" + (parseInt(codeInt) + 1);
         form.setValues({
            kode: code,
            nama: "",
            status: "INACTIVE"
         })
      }
   }, []);
   const submitHandler = async (e) => {
      e.preventDefault();
      if (form.validate().hasErrors) return false;
      setLoading(false);
      const data = form.values
      const method = action === "edit" ? "PUT" : "POST";
      const url = action === "edit" ? `/api/produk/${produk.id}` : `/api/produk`;
      await fetch(url, {
         method,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ ...data, updatedId: 1, createdId: 1 })
      }).then(res => {
         if (res.status === 200) {
       
            router.push({
               pathname: "/produk"
            });
         } else {
            setLoading(true);
            setNotif({
               show: true,
               message: res.statusText,
               title: "Error"
            })
         }
      })

   }
   return (
      <Layout>
         <div className="loader" hidden={loading}>
            <Loader size="xl" variant="bars" color="orange" />;
         </div>
         <Head>
            <title>Master Produk</title>
         </Head>
         <Title order={2} style={{ marginBottom: "1.5rem" }}>
            Form Produk
         </Title>

         <Box sx={(theme) => ({
            border: "1px solid",
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            backgroundColor:
               theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
            borderColor:
               theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[4],
         })} >
            <form autoComplete="off" method="post" onSubmit={submitHandler}>
               <Grid>
                  <Grid.Col sm={12} md={6}>
                     <Group direction="column" grow spacing="lg">
                        <InputWrapper label="Kode">
                           <Input name="kode" readOnly value={form.values.kode} />
                        </InputWrapper>
                        <InputWrapper label="Nama">
                           <TextInput {...form.getInputProps('nama')} value={form.values.nama} onChange={(e) => form.setFieldValue("nama", e.currentTarget.value)} />
                        </InputWrapper>
                        <InputWrapper label="Status">
                           <Switch name="status" checked={form.values.status === "ACTIVE"} onChange={(e) => form.setFieldValue("status", e.currentTarget.checked ? "ACTIVE" : "INACTIVE")} onLabel="ON" offLabel="OFF" size="lg" radius="lg" />
                        </InputWrapper>
                        <div> <Button type="button" onClick={() => router.push("/produk")} color="red">Back</Button> <Button type="submit">Submit</Button></div>
                     </Group>
                  </Grid.Col>
               </Grid></form>
         </Box>
      </Layout>
   );
}
export async function getServerSideProps(context) {
   const id = context.query.id;
   let produk = {};
   let action;
   if (id) {
      let res = await fetch(`http://localhost:3000/api/produk/${id}`);
      action = "edit";
      produk = await res.json();
      if (res.status === 403) {
         let res = await fetch(`http://localhost:3000/api/produk`);
         const produks = await res.json();
         produk = produks.length > 0 ? produks[0] : produks;
         action = "add";
      }
   } else {
      let res = await fetch(`http://localhost:3000/api/produk`);
      const produks = await res.json();
      produk = produks.length > 0 ? produks[0] : produks;
      action = "add";
   }

   return {
      props: {
         action,
         produk
      }
   }
}
export default Form;