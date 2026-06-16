import type { ReactNode, CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AppleLogo } from "./AppleLogo";
import styles from "./DeskDecor.module.css";

/** A floating, hoverable retro item. Idle-bobs unless reduced-motion. */
function Float({
  children,
  dur,
  delay = 0,
  sway = 3,
  style,
}: {
  children: ReactNode;
  dur: number;
  delay?: number;
  sway?: number;
  style: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={styles.item}
      style={style}
      animate={reduce ? undefined : { y: [0, -12, 0], rotate: [-sway, sway, -sway] }}
      transition={{ repeat: Infinity, duration: dur, delay, ease: "easeInOut" }}
      whileHover={{ scale: 1.12, rotate: [0, -8, 8, 0] }}
    >
      {children}
    </motion.div>
  );
}

/* ---- Translucent iMac G3 (Bondi) ---- */
function IMacG3() {
  return (
    <svg viewBox="0 0 130 145" width="120" aria-label="iMac G3">
      <ellipse cx="65" cy="132" rx="36" ry="9" fill="rgba(0,149,182,0.25)" />
      <path d="M50 96 h30 l8 24 h-46 z" fill="rgba(0,149,182,0.5)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="14" y="10" width="102" height="96" rx="36" fill="rgba(0,149,182,0.45)" stroke="var(--ink)" strokeWidth="3" />
      <rect x="14" y="10" width="102" height="40" rx="36" fill="rgba(255,255,255,0.35)" />
      <rect x="32" y="28" width="66" height="54" rx="8" fill="#0c1f24" stroke="var(--ink)" strokeWidth="2" />
      <rect x="38" y="34" width="54" height="42" rx="3" fill="#bfe9f0" />
      <circle cx="65" cy="93" r="3" fill="#0c1f24" />
    </svg>
  );
}

/* ---- Power Mac G4 Cube ---- */
function G4Cube() {
  return (
    <svg viewBox="0 0 100 120" width="84" aria-label="G4 Cube">
      <ellipse cx="48" cy="108" rx="32" ry="8" fill="rgba(0,0,0,0.12)" />
      <polygon points="20,28 34,16 82,16 68,28" fill="#e4e8ec" stroke="var(--ink)" strokeWidth="2.5" />
      <polygon points="68,28 82,16 82,82 68,94" fill="#aab2bb" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="20" y="28" width="48" height="66" fill="rgba(214,222,229,0.7)" stroke="var(--ink)" strokeWidth="2.5" />
      <line x1="40" y1="20" x2="62" y2="20" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <AppleSilhouette x={36} y={48} size={18} />
    </svg>
  );
}

/* ---- Classic one-button mouse ---- */
function Mouse() {
  return (
    <svg viewBox="0 0 80 64" width="64" aria-label="Mouse">
      <path d="M40 10 q26 -6 26 14" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="10" y="18" width="48" height="40" rx="18" fill="#ece7d8" stroke="var(--ink)" strokeWidth="2.5" />
      <line x1="34" y1="20" x2="34" y2="34" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

/* ---- 3.5" floppy disk ---- */
function Floppy() {
  return (
    <svg viewBox="0 0 80 80" width="70" aria-label="Floppy disk">
      <path d="M10 6 h52 l10 10 v58 h-62 z" fill="var(--imac-grape)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="20" y="6" width="34" height="24" fill="#cfd3d6" stroke="var(--ink)" strokeWidth="2" />
      <rect x="40" y="9" width="10" height="18" fill="#8a8f93" />
      <rect x="18" y="40" width="44" height="30" rx="2" fill="#f4f1e8" stroke="var(--ink)" strokeWidth="2" />
      <line x1="24" y1="50" x2="56" y2="50" stroke="var(--ink)" strokeWidth="2" />
      <line x1="24" y1="58" x2="56" y2="58" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

/* tiny gray Apple mark for the Cube */
function AppleSilhouette({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 170})`}>
      <path
        d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.24z"
        fill="#6b7178"
      />
    </g>
  );
}

/** Floating museum of Apple hardware around the desktop. */
export function DeskDecor() {
  return (
    <div className={styles.layer} aria-hidden>
      <Float dur={6} style={{ left: "3%", bottom: "8%" }}>
        <IMacG3 />
      </Float>
      <Float dur={7} delay={0.6} style={{ right: "4%", bottom: "10%" }}>
        <G4Cube />
      </Float>
      <Float dur={5} delay={0.3} sway={5} style={{ left: "30%", bottom: "5%" }}>
        <Mouse />
      </Float>
      <Float dur={6.5} delay={1} sway={6} style={{ right: "26%", top: "78%" }}>
        <Floppy />
      </Float>
      <Float dur={8} delay={0.2} sway={8} style={{ left: "1.5%", top: "32%" }}>
        <AppleLogo size={46} />
      </Float>
    </div>
  );
}
