import { appsByCategory, styleFor, getCategory, BADGE_LABEL } from "../../lib/data";
import { useDesktop } from "../../store/useDesktop";
import styles from "./windows.module.css";

/** Lists the apps in a category. Clicking one opens its Get Info window. */
export function CategoryWindow({ categoryId }: { categoryId: string }) {
  const openWindow = useDesktop((s) => s.openWindow);
  const list = appsByCategory(categoryId);
  const cat = getCategory(categoryId);
  const s = styleFor(categoryId);

  return (
    <div>
      <div className={styles.listHeader}>
        {list.length} {list.length === 1 ? "app" : "apps"} in {cat?.name}
      </div>

      {list.length === 0 && (
        <div className={styles.empty}>No apps here yet — coming soon. ⛏</div>
      )}

      <ul className={styles.list}>
        {list.map((app) => (
          <li key={app.id}>
            <button
              className={styles.row}
              type="button"
              onClick={() =>
                openWindow({
                  id: `app:${app.id}`,
                  kind: "appInfo",
                  title: app.name,
                  payload: app.id,
                })
              }
            >
              <span
                className={styles.tile}
                style={{ ["--folder" as string]: s.color }}
              >
                {s.glyph}
              </span>
              <span className={styles.rowText}>
                <span className={styles.rowName}>
                  {app.name}
                  {app.featured && <span className={styles.star}>★</span>}
                </span>
                <span className={styles.rowDesc}>{app.description}</span>
                <span className={styles.badges}>
                  {app.badges.map((b) => (
                    <span key={b} className={styles.badge}>
                      {BADGE_LABEL[b] ?? b}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
