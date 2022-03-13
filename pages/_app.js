import { useState } from "react";
import Head from "next/head";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { SessionProvider } from "next-auth/react";

import { GlobalContextProvider } from "@components/contexts/GlobalContext";

import "@styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
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

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: colorScheme,
        }}
      >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <SessionProvider session={session}>
            <GlobalContextProvider>
              <Component {...pageProps} />
            </GlobalContextProvider>
          </SessionProvider>
        </ColorSchemeProvider>
      </MantineProvider>
    </>
  );
}
