import { useEffect } from "react";
import Router from "next/router";
import { toast } from "react-toastify";

import { LoadingIndicator } from "../components/loading-indicator";
import { useAuth } from "../contexts/auth";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout()
      .then(() => {
        Router.push("/login");
      })
      .catch((err) => {
        toast.error(err.message);
        Router.push("/");
      });
  }, []);

  return <LoadingIndicator />;
}
