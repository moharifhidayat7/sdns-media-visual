import Head from "next/head";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";

import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import DeleteModal from "@components/Modals/DeleteModal";
import { GlobalContextProvider } from "@components/contexts/GlobalContext";

// import 'tailwindcss/tailwind.css'
import "@styles/globals.css";
import "@styles/custom.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/mvb_icon.png" type="image/png" />
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
              colorScheme,
            }}
          >
            <NotificationsProvider>
              <GlobalContextProvider>
                <ModalsProvider modals={{ delete: DeleteModal }}>
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
