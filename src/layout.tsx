import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import styles from "./layout.module.css";

export function Header() {
  const router = useRouter();
  const HomeElement = router.asPath === "/" ? "h1" : "h2";
  return (
    <header>
      <Link href="/">
        <a className={styles["home-link"]}>
          <HomeElement>dflate.io</HomeElement>
        </a>
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        {[
          ["https://mobile.twitter.com/gr__or", "Twitter"],
          ["https://github.com/Gregoor", "GitHub"],
          ["mailto:gregorwbr@gmail.com", "E-Mail"],
        ].map(([href, label], i, arr) => (
          <React.Fragment key={href}>
            <a href={href}>{label}</a>
            {i + 1 < arr.length && " / "}
          </React.Fragment>
        ))}
      </div>
      <Link href="/rss.xml">
        <a>RSS</a>
      </Link>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{children}</main>
      <br />
      <Footer />
    </div>
  );
}
