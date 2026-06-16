import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppleLogo } from "./AppleLogo";
import styles from "./MenuBar.module.css";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 10);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Top menu bar with the rainbow Apple mark + live clock. Menus are
 *  non-functional in Phase 0/1 — wired up with the window manager in Phase 3. */
export function MenuBar() {
  const time = useClock();
  return (
    <div className={styles.bar} role="menubar">
      <motion.span
        className={styles.logo}
        aria-label="Lookout"
        whileHover={{ rotate: [0, -12, 12, -8, 0], scale: 1.15 }}
        transition={{ duration: 0.5 }}
      >
        <AppleLogo size={16} />
      </motion.span>
      <span className={styles.itemBold}>Lookout</span>
      <span className={styles.item}>File</span>
      <span className={styles.item}>Edit</span>
      <span className={styles.item}>View</span>
      <span className={styles.item}>Special</span>
      <span className={styles.spacer} />
      <span className={styles.clock}>🔆 {time}</span>
    </div>
  );
}
