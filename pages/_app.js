import { useState } from "react";
import Head from "next/head";
import Layout from "@components/views/Layout";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";

import { GlobalContextProvider } from "@components/contexts/GlobalContext";

import "@styles/globals.css";

export default function App(props) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState("light");

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme,
          }}
        >
          <GlobalContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GlobalContextProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
