import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Link from "next/link";

import { useRouter } from "next/router";

import { LoadingIndicator } from "../components/loading-indicator";
import { PaginatedResponse } from "../core/interfaces/base";
import { Note } from "../core/interfaces/note";
import api from "../services/api";

import styles from "../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();

  const { isLoading, isError, data, error } = useQuery<PaginatedResponse<Note>, AxiosError>("/notes", () =>
    api.get("/notes").then(({ data }) => data)
  );

  if (isError) {
    toast.error(error?.message);
    return null;
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ul>
      <button
        onClick={() => {
          router.push("/logout");
        }}
      >
        logout
      </button>
      {data?.result.map((note) => {
        return (
          <li key={note.id}>
            <h4>
              <Link href={`/notes/${note.id}`}>
                <a>{note.title}</a>
              </Link>
            </h4>
          </li>
        );
      })}
    </ul>
  );
}
