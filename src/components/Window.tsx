import type { ReactNode } from "react";
import { motion, useDragControls } from "framer-motion";
import { useDesktop, type WindowInstance } from "../store/useDesktop";
import styles from "./Window.module.css";

/** Generic classic-Mac window: draggable by its title bar, click-to-focus,
 *  with working close box. Content is passed as children. */
export function Window({
  instance,
  children,
  width = 460,
}: {
  instance: WindowInstance;
  children: ReactNode;
  width?: number;
}) {
  const controls = useDragControls();
  const closeWindow = useDesktop((s) => s.closeWindow);
  const bringToFront = useDesktop((s) => s.bringToFront);
  const focusedId = useDesktop((s) => s.focusedId);
  const isFocused = focusedId === instance.id;

  return (
    <motion.div
      className={`${styles.window} ${isFocused ? styles.focused : ""}`}
      style={{ left: instance.x, top: instance.y, zIndex: 100 + instance.z, width }}
      drag
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      onPointerDownCapture={() => bringToFront(instance.id)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
    >
      <div
        className={styles.titlebar}
        onPointerDown={(e) => controls.start(e)}
        onDoubleClick={() => closeWindow(instance.id)}
      >
        <button
          className={styles.closeBox}
          type="button"
          aria-label="Close"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => closeWindow(instance.id)}
        />
        <div className={`${styles.stripes} pat-pinstripe`} aria-hidden />
        <span className={styles.title}>{instance.title}</span>
        <div className={`${styles.stripes} pat-pinstripe`} aria-hidden />
        <span className={styles.zoomBox} aria-hidden />
      </div>

      <div className={styles.body}>{children}</div>
    </motion.div>
  );
}
