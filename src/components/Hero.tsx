import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AppleLogo } from "./AppleLogo";
import { MacGuy } from "./MacGuy";
import styles from "./Hero.module.css";

const MARQUEE =
  "★ Spot the best apps for your Mac ★ 8 categories ★ hand-picked ★ open-source friendly ★ 100% fresh ";

/** The main "hello" window: poster header + a Finder-style shelf that holds
 *  the category folders (passed as children) + a status footer. */
export function Hero({
  children,
  folderCount,
}: {
  children: ReactNode;
  folderCount: number;
}) {
  return (
    <motion.section
      className={styles.window}
      initial={{ opacity: 0, y: -24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      {/* pinstriped title bar */}
      <div className={styles.titlebar}>
        <span className={styles.closeBox} aria-hidden />
        <div className={`${styles.stripes} pat-pinstripe`} aria-hidden />
        <span className={styles.titleText}>hello</span>
        <div className={`${styles.stripes} pat-pinstripe`} aria-hidden />
        <span className={styles.zoomBox} aria-hidden />
      </div>

      {/* poster body */}
      <div className={styles.body}>
        <motion.div
          className={styles.logo}
          animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <AppleLogo size={88} />
        </motion.div>

        <div className={styles.headline}>
          <h1 className={styles.wordmark} data-text="Lookout">
            Lookout
          </h1>
          <div className={styles.marquee}>
            <div className={styles.marqueeTrack}>
              <span>{MARQUEE}</span>
              <span>{MARQUEE}</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <MacGuy />
          <span className={styles.metaText}>VOL.1 · EST. 1984</span>
        </div>
      </div>

      {/* shelf toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.toolbarTitle}>📁 Browse by category</span>
        <span className={styles.toolbarHint}>pick a folder to start digging ⛏</span>
      </div>

      {/* folders live here */}
      <div className={styles.shelf}>{children}</div>

      {/* status footer */}
      <div className={styles.footer}>
        <span>{folderCount} folders</span>
        <span className={styles.footerRight}>Lookout System 1.0</span>
      </div>
    </motion.section>
  );
}
