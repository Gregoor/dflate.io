import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import styles from "./layout.module.css";

export function Header() {
  const router = useRouter();
  const HomeHeading = router.asPath === "/" ? "h1" : "h2";

  const [hasNewlyArrived, setHasNewlyArrived] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationTimeRef = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => setHasNewlyArrived(false), 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const TOTAL = 5;
    const LINE_WIDTH = 1.5;

    const canvas = canvasRef.current;

    const size = canvas.parentElement!.offsetHeight;
    const center = size / 2;

    canvas.height = canvas.width = size;
    Object.assign(canvas.style, {
      width: `${size}px`,
      height: `${size}px`,
    });

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "hsl(0,0%, 20%)";
    ctx.lineWidth = LINE_WIDTH;

    let lastFrameTime = performance.now();
    let animationFrame: number;

    function draw(time: number | null = null) {
      const now = animationTimeRef.current / 150;
      if (time) {
        animationTimeRef.current += time - lastFrameTime;
        lastFrameTime = time;
      }

      ctx.clearRect(0, 0, size, size);

      for (let i = 0; i < TOTAL; i++) {
        const radius = Math.max(size - ((now * i) % size) - 2 * LINE_WIDTH, 0);
        ctx.beginPath();
        ctx.arc(center, center, radius / 2, 0, 2 * Math.PI);
        ctx.stroke();
      }

      if (isRouting || isHovering || hasNewlyArrived) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    draw();

    const start = () => {
      setIsRouting(true);
      draw();
    };
    const stop = () => {
      setIsRouting(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", stop);
    Router.events.on("routeChangeError", stop);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", stop);
      Router.events.off("routeChangeError", stop);
      cancelAnimationFrame(animationFrame);
    };
  }, [isRouting, isHovering, hasNewlyArrived]);

  return (
    <header className={styles.header}>
      <Link href="/">
        <a
          className={styles["home-link"]}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <canvas ref={canvasRef} className={styles["logo-canvas"]} />
          <HomeHeading style={{ marginTop: "1%" }}>dflate.io</HomeHeading>
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
          ["https://mobile.twitter.com/watware", "Twitter"],
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
      <Footer />
    </div>
  );
}
