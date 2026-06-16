import appsRaw from "../data/apps.json";
import extraApps from "../data/extra-apps.json";
import catsRaw from "../data/categories.json";
import type { App, Category } from "./schema";

// Curated extras (hand-added apps) take precedence over the parsed set and
// survive re-running the awesome-mac importer. Featured ones float to the top.
const parsed = appsRaw as App[];
const extras = extraApps as App[];
const extraIds = new Set(extras.map((a) => a.id));
export const apps: App[] = [
  ...extras,
  ...parsed.filter((a) => !extraIds.has(a.id)),
];
export const categories = (catsRaw as Category[])
  .slice()
  .sort((a, b) => a.order - b.order);

export const appsByCategory = (categoryId: string): App[] =>
  apps
    .filter((a) => a.category === categoryId)
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));

export const getApp = (id: string): App | undefined =>
  apps.find((a) => a.id === id);

export const getCategory = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

/** Visual identity per category — read from the imported category data. */
export const styleFor = (categoryId: string): { color: string; glyph: string } => {
  const cat = getCategory(categoryId);
  return {
    color: cat?.color ?? "var(--six-yellow)",
    glyph: cat?.icon ?? "📁",
  };
};

export const BADGE_LABEL: Record<string, string> = {
  "open-source": "Open Source",
  freeware: "Free",
  "app-store": "App Store",
  native: "Native",
};
