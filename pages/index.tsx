import Head from "next/head";
import Link from "next/link";

import Layout from "../src/layout";
import { getAllPages, StaticProps } from "../src/utils";

export const config = { unstable_runtimeJS: false };

export async function getStaticProps() {
  return {
    props: {
      pages: await getAllPages(),
    },
  };
}

export default ({ pages }: StaticProps<typeof getStaticProps>) => (
  <Layout>
    <Head>
      <title>dflate.io</title>
    </Head>
    {pages.map(({ slug, title, date }) => (
      <div key={slug}>
        <Link href={`/${slug}`}>
          <a>
            <h2>{title}</h2>
          </a>
        </Link>
        <time>{new Date(date).toISOString().split("T")[0]}</time>
      </div>
    ))}
  </Layout>
);
