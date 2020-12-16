import Head from "next/head";
import Link from "next/link";

import Layout from "../src/layout";
import { getAllPages, StaticProps } from "../src/utils";

export async function getStaticProps() {
  return {
    props: {
      pages: await getAllPages(),
    },
  };
}

export default function Index({ pages }: StaticProps<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>dflate.io</title>
      </Head>
      {pages
        .map((page) => ({ ...page, date: new Date(page.date) }))
        .sort((p1, p2) => (p1.date > p2.date ? -1 : 1))
        .map(({ slug, title, date }) => (
          <div key={slug} style={{ padding: "15px 0" }}>
            <Link href={`/${slug}`}>
              <a>
                <h2>{title}</h2>
              </a>
            </Link>
            <time>{date.toISOString().split("T")[0]}</time>
          </div>
        ))}
    </Layout>
  );
}
