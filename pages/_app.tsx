// _app.tsx
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store, { persistor } from "@/redux-state/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { auth } from "@/utils/firebaseConfig";
import { getAuthTokenCookie } from "@/utils/auth";
import { TimeSpentProvider } from "@/contexts/TimeSpentContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPages = [
    "/login",
    "/signup",
    "/forgetPassword",
    "/resetPassword",
    "/privacyPolicy",
  ];
  const isNotLayoutPages = isAuthPages.includes(router.pathname);

  useEffect(() => {
    const authToken = getAuthTokenCookie();
    const handleRouteChange = (url: string) => {
      if (!authToken && !isAuthPages.includes(url)) {
        router.push("/login");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TimeSpentProvider>
          <ToastContainer />
          {isNotLayoutPages ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            </Layout>
          )}
        </TimeSpentProvider>
      </PersistGate>
    </Provider>
  );
}
