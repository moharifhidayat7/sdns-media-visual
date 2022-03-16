import { useState } from "react";
import Head from "next/head";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  Loader,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

import { GlobalContextProvider } from "@components/contexts/GlobalContext";

import "@styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';

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
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
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
            <NotificationsProvider>
              <GlobalContextProvider>
                <ModalsProvider>
                  <Component {...pageProps} />
                </ModalsProvider>
              </GlobalContextProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}
