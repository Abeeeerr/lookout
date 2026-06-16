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
