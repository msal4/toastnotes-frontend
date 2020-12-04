import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import Router from "next/router";
import cookie from "js-cookie";

const baseURL = `${process.env.NEXT_PUBLIC_HOST}/api/v1`;

const api = Axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface AxiosRetryRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

const refreshTokenCookieName = "herz";
const accessTokenCookieName = "seele";

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    // append a retry field so we know its a retry request and avoid recursion.
    const originalRequest = err.config as AxiosRetryRequestConfig;

    // if the user is not authorized it probably means their access token has expired.
    // also check if its not a retry request
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      Router.pathname !== "/login" &&
      Router.pathname !== "/logout"
    ) {
      originalRequest._retry = true;

      return Axios.post(`${baseURL}/refresh`)
        .then(() => {
          return Axios(originalRequest);
        })
        .catch(() => {
          console.log("cookies:", cookie.get(refreshTokenCookieName) || cookie.get(accessTokenCookieName));
          if (cookie.get(refreshTokenCookieName) || cookie.get(accessTokenCookieName)) {
            return Router.push("/logout");
          }
          return Promise.resolve(true);
        });
    }
    // its hopeless just return the original error.
    return Promise.reject(err);
  }
);

export default api;
