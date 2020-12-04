import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { LoadingIndicator } from "../../components/loading-indicator";
import { NoteContent } from "../../core/interfaces/note";
import api from "../../services/api";
import { parseMarkdownToHtml } from "../../utils/markdown";

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  const { isSuccess, isError, isLoading, data, error } = useQuery<NoteContent>(["/notes", id], () =>
    api.get(`/notes/${id}`).then(({ data }) => data)
  );
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      parseMarkdownToHtml(data?.content).then((c) => setContent(c));
    }
  }, [data?.content]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
}
