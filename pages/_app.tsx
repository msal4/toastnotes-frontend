import { AppProps } from "next/app";
import { ReactQueryDevtools } from "react-query-devtools";
import { toast, ToastContainer } from "react-toastify";

import { AuthProvider, ProtectRoute } from "../contexts/auth";

import "normalize.css/normalize.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.scss";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <ProtectRoute>
          <Component {...pageProps} />
        </ProtectRoute>
      </AuthProvider>
      <ToastContainer position="bottom-right" closeButton={false} />
      {process.env.NODE_ENV === "development" ? <ReactQueryDevtools /> : null}
    </>
  );
}

export default MyApp;
