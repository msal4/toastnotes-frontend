import { FormEvent, useEffect, useState } from "react";
import Router from "next/router";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { useAuth } from "../contexts/auth";
import { Credentials } from "../core/interfaces/auth";
import { AuthError } from "../core/interfaces/error";

import styles from "./login.module.scss";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mutate, { isSuccess, isLoading, isError, data, error }] = useMutation<
    void,
    AxiosError<AuthError>,
    Credentials
  >(login);

  const errData = error?.response?.data;

  useEffect(() => {
    if (errData?.error) {
      toast.error(errData?.error);
    }
  }, [errData?.error]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    await mutate({ email, password });
  };

  if (isSuccess || user) {
    const next = Router.query.next ?? "/";
    Router.push(next as string);
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            value={email}
            name="email"
            disabled={isLoading}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.error}>{errData?.errors?.find((err) => err.field === "email")?.reason}</div>
        </div>
        <input
          type="password"
          value={password}
          name="password"
          disabled={isLoading}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.error}>{errData?.errors?.find((err) => err.field === "password")?.reason}</div>
        <button type="submit" disabled={isLoading}>
          Login
        </button>
      </form>
      <div className={styles.error}>{errData?.error}</div>
    </div>
  );
}
