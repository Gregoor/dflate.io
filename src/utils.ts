import fs from "fs";
import path from "path";

import matter from "gray-matter";
import unified from "unified";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypePrism from "@mapbox/rehype-prism";
import remarkParse from "remark-parse";
import remark2rehype from "remark-rehype";

export type StaticProps<T> = T extends (
  ...params: any[]
) => Promise<{ props: infer P }>
  ? P
  : never;

export const CONTENT_PATH = path.join("public", "content");

export async function parseContent(slug) {
  const {
    data: { title, date },
    content,
  } = matter(
    fs.readFileSync(path.join(CONTENT_PATH, slug, "index.md"), "utf-8")
  );
  return {
    title,
    date,
    html: (
      await unified()
        .use(remarkParse)
        .use(remark2rehype)
        .use(rehypePrism)
        .use(rehypeSlug)
        .use(rehypeAutolink, { behavior: "wrap" })
        .use(rehypeStringify)
        .process(content)
    ).contents,
  };
}

export async function getAllPages() {
  return Promise.all(
    fs.readdirSync(CONTENT_PATH).map(async (slug) => ({
      slug,
      ...(await parseContent(slug)),
    }))
  );
}
