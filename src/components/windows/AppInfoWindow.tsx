import { getApp, styleFor, BADGE_LABEL } from "../../lib/data";
import styles from "./windows.module.css";

/** "Get Info" detail view for a single app. */
export function AppInfoWindow({ appId }: { appId: string }) {
  const app = getApp(appId);
  if (!app) return <div className={styles.empty}>App not found.</div>;
  const s = styleFor(app.category);

  return (
    <div className={styles.info}>
      <div className={styles.infoHead}>
        <span
          className={styles.tileLg}
          style={{ ["--folder" as string]: s.color }}
        >
          {s.glyph}
        </span>
        <div>
          <h2 className={styles.infoName}>{app.name}</h2>
          {app.price && <span className={styles.price}>{app.price}</span>}
        </div>
      </div>

      <p className={styles.infoDesc}>{app.description}</p>

      {app.badges.length > 0 && (
        <div className={styles.badges}>
          {app.badges.map((b) => (
            <span key={b} className={styles.badge}>
              {BADGE_LABEL[b] ?? b}
            </span>
          ))}
        </div>
      )}

      {app.tags.length > 0 && (
        <div className={styles.tags}>
          {app.tags.map((t) => (
            <span key={t} className={styles.tag}>
              #{t}
            </span>
          ))}
        </div>
      )}

      <a
        className={styles.visit}
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit site →
      </a>
    </div>
  );
}
