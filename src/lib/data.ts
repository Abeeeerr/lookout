import appsRaw from "../data/apps.json";
import catsRaw from "../data/categories.json";
import type { App, Category } from "./schema";

export const apps = appsRaw as App[];
export const categories = (catsRaw as Category[])
  .slice()
  .sort((a, b) => a.order - b.order);

export const appsByCategory = (categoryId: string): App[] =>
  apps.filter((a) => a.category === categoryId);

export const getApp = (id: string): App | undefined =>
  apps.find((a) => a.id === id);

export const getCategory = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

/** Visual identity per category — shared by the desktop folders and windows. */
export const CATEGORY_STYLE: Record<string, { color: string; glyph: string }> = {
  dev: { color: "var(--imac-bondi)", glyph: "🛠" },
  utilities: { color: "var(--imac-tangerine)", glyph: "🧰" },
  design: { color: "var(--imac-strawberry)", glyph: "🎨" },
  writing: { color: "var(--imac-grape)", glyph: "✍️" },
  ai: { color: "var(--imac-lime)", glyph: "🤖" },
  av: { color: "var(--six-red)", glyph: "🎬" },
  browsers: { color: "var(--six-blue)", glyph: "🌐" },
  security: { color: "var(--six-purple)", glyph: "🔒" },
};

export const styleFor = (categoryId: string) =>
  CATEGORY_STYLE[categoryId] ?? { color: "var(--six-yellow)", glyph: "📁" };

export const BADGE_LABEL: Record<string, string> = {
  "open-source": "Open Source",
  freeware: "Free",
  "app-store": "App Store",
  native: "Native",
};
