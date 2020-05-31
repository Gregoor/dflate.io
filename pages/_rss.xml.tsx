import * as fs from "fs";
import * as path from "path";

import RSS from "rss";
import { getAllPages, StaticProps } from "../src/utils";

// This whole thing is a bit hacky, as it adds a route just for the sake
// of keeping RSS building inside of Next

const SITE_URL = "https://dflate.io";

export async function getStaticProps() {
  const feed = new RSS({
    title: "dflate.io",
    description: "Thoughts about things",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/rss.xml`,
    custom_namespaces: {
      content: "http://purl.org/rss/1.0/modules/content/",
    },
  });

  for (const page of await getAllPages()) {
    feed.item({
      title: page.title,
      url: `${SITE_URL}/${page.slug}`,
      custom_elements: [
        {
          "content:encoded": {
            _cdata: page.html,
          },
        },
      ],
    });
  }

  const xml = feed.xml({ indent: true });

  fs.writeFileSync(path.join("public", "rss.xml"), xml);

  return { props: { xml } };
}

export default function ({ xml }: StaticProps<typeof getStaticProps>) {
  return `${xml}`;
}
