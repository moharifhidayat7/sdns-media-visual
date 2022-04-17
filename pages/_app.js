import Head from "next/head";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";

import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import DeleteModal from "@components/Modals/DeleteModal";
import { GlobalContextProvider } from "@components/contexts/GlobalContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";

// import 'tailwindcss/tailwind.css'
import "@styles/globals.css";
import "@styles/custom.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [router.events]);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/mvb_icon.png" type="image/png" />
      </Head>
      <Loading isRouteChanging={state.isRouteChanging} key={state.loadingKey} />
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
