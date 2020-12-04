import remark from "remark";
import html from "remark-html";

export async function parseMarkdownToHtml(content: string): Promise<string> {
  const processedContent = await remark().use(html).process(content);
  return processedContent.toString();
}
