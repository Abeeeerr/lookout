import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AppleLogo } from "./AppleLogo";
import styles from "./BootSequence.module.css";

/** Classic Mac "Welcome" boot screen shown once per browser session.
 *  Dark screen → rainbow Apple → progress bar → CRT flash reveal. */
export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"booting" | "done">("booting");

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    const t = setTimeout(() => setPhase("done"), 3200);
    return () => clearTimeout(t);
  }, [reduce, onDone]);

  if (reduce) return null;

  return (
    <AnimatePresence onExitComplete={onDone}>
      {phase === "booting" && (
        <motion.div
          className={styles.screen}
          initial={{ opacity: 1 }}
          exit={{
            // CRT power-off: flash bright, collapse to a line, vanish
            scaleY: [1, 1, 0.004],
            scaleX: [1, 1.04, 1.2],
            filter: ["brightness(1)", "brightness(2.4)", "brightness(3)"],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.55, ease: "easeIn" }}
          onClick={() => setPhase("done")}
          title="Click to skip"
        >
          <div className={styles.center}>
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={styles.logo}
            >
              <AppleLogo size={120} />
            </motion.div>

            <motion.p
              className={styles.welcome}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              Welcome to Lookout
            </motion.p>

            <div className={styles.barTrack}>
              <motion.div
                className={`${styles.barFill} pat-rainbow`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1.7, ease: "easeInOut" }}
              />
            </div>
          </div>

          <span className={styles.skip}>click to skip</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
