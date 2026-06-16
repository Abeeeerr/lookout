import { motion } from "framer-motion";
import styles from "./MacGuy.module.css";

/** A little compact Macintosh (1984) with a blinking Happy Mac face.
 *  Pure SVG so it stays crisp; gently bobs and blinks on its own. */
export function MacGuy() {
  return (
    <motion.div
      className={styles.wrap}
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      whileHover={{ rotate: [0, -3, 3, 0], scale: 1.05 }}
      title="hello"
    >
      <svg viewBox="0 0 120 150" width="104" height="130" aria-label="Happy Mac">
        {/* body */}
        <rect
          x="4"
          y="4"
          width="112"
          height="142"
          rx="14"
          fill="#e9e4d6"
          stroke="var(--ink)"
          strokeWidth="3"
        />
        {/* screen bezel */}
        <rect x="16" y="18" width="88" height="70" rx="6" fill="#cfc8b6" />
        {/* screen */}
        <rect x="24" y="26" width="72" height="54" rx="3" fill="#3fc6da" />

        {/* Happy Mac face (pixel-ish) */}
        <g fill="#0b2a30">
          {/* eyes — blink via CSS */}
          <rect className={styles.eye} x="44" y="40" width="6" height="12" rx="1" />
          <rect className={styles.eye} x="70" y="40" width="6" height="12" rx="1" />
          {/* nose */}
          <rect x="57" y="50" width="6" height="6" />
          {/* smile */}
          <path
            d="M44 60 q16 14 32 0"
            fill="none"
            stroke="#0b2a30"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* floppy slot */}
        <rect x="28" y="100" width="64" height="9" rx="2" fill="#c6bfad" stroke="var(--ink)" strokeWidth="1.5" />
        {/* little rainbow Apple badge */}
        <g>
          <rect x="20" y="120" width="5" height="3" fill="var(--six-green)" />
          <rect x="20" y="123" width="5" height="3" fill="var(--six-yellow)" />
          <rect x="20" y="126" width="5" height="3" fill="var(--six-orange)" />
          <rect x="25" y="120" width="5" height="3" fill="var(--six-red)" />
          <rect x="25" y="123" width="5" height="3" fill="var(--six-purple)" />
          <rect x="25" y="126" width="5" height="3" fill="var(--six-blue)" />
        </g>
      </svg>
    </motion.div>
  );
}
