import { Title, Box, Grid, InputWrapper, Input, Group } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@components/views/Layout";
import { inputNumberOnly } from "helpers/functions";

export default function Form() {
   return (
      <Layout>
         <Head>
            <title>Master Produk</title>
         </Head>
         <Title order={2} style={{ marginBottom: "1.5rem" }}>
            Form Produk
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
            <Grid>
               <Grid.Col md={12} lg={6}>
                  <Group direction="column" grow spacing="lg">
                     <InputWrapper label="Kode">
                        <Input />
                     </InputWrapper>
                     <InputWrapper label="Nama">
                        <Input onInput={(e)=>inputNumberOnly(e)}/>
                     </InputWrapper>
                  </Group>
               </Grid.Col>
            </Grid>
         </Box>
      </Layout>
   );
}