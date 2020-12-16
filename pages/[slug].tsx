import * as fs from "fs";

import Layout from "../src/layout";
import { CONTENT_PATH, parseContent, StaticProps } from "../src/utils";
import Head from "next/head";

export async function getStaticPaths() {
  const folderNames = fs.readdirSync(CONTENT_PATH);
  return {
    paths: folderNames.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      slug: slug,
      ...(await parseContent(slug)),
    },
  };
}

export default ({ title, html }: StaticProps<typeof getStaticProps>) => (
  <Layout>
    <Head>
      <title>{title}</title>
    </Head>
    <h1>{title}</h1>
    <main dangerouslySetInnerHTML={{ __html: html as string }} />
  </Layout>
);
