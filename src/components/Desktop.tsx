import { motion } from "framer-motion";
import { MenuBar } from "./MenuBar";
import { Hero } from "./Hero";
import { DeskDecor } from "./DeskDecor";
import { WindowLayer } from "./WindowLayer";
import { categories as cats, styleFor } from "../lib/data";
import { useDesktop } from "../store/useDesktop";
import styles from "./Desktop.module.css";

const grid = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const folderIn = {
  hidden: { opacity: 0, y: 24, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 18 },
  },
};

export function Desktop() {
  const openWindow = useDesktop((s) => s.openWindow);

  return (
    <div className={`${styles.desktop} pat-dither`}>
      <div className={styles.crt} aria-hidden />

      <DeskDecor />

      <WindowLayer />

      <MenuBar />

      <main className={styles.surface}>
        <Hero folderCount={cats.length}>
          <motion.div
            className={styles.iconGrid}
            variants={grid}
            initial="hidden"
            animate="show"
            aria-label="Categories"
          >
            {cats.map((cat) => {
              const s = styleFor(cat.id);
              return (
                <motion.button
                  key={cat.id}
                  className={styles.folder}
                  type="button"
                  style={{ ["--folder" as string]: s.color }}
                  variants={folderIn}
                  whileHover="hover"
                  whileTap={{ scale: 0.92 }}
                  onDoubleClick={() =>
                    openWindow({
                      id: `category:${cat.id}`,
                      kind: "category",
                      title: cat.name,
                      payload: cat.id,
                    })
                  }
                >
                  <motion.span
                    className={styles.folderIcon}
                    variants={{ hover: { y: -10, rotate: -3, scale: 1.08 } }}
                  >
                    <span className={styles.folderLid} aria-hidden />
                    <motion.span
                      className={styles.folderGlyph}
                      variants={{
                        hover: { scale: 1.25, rotate: [0, -10, 10, 0] },
                      }}
                    >
                      {s.glyph}
                    </motion.span>
                  </motion.span>
                  <span className={styles.folderLabel}>{cat.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </Hero>
      </main>
    </div>
  );
}
