/* Lookout — data schema (see DESIGN.md §4) */

export type Badge = "open-source" | "freeware" | "app-store" | "native";

export type Price = "free" | "freemium" | "paid" | "open-source";

export type App = {
  id: string; // stable slug
  name: string;
  url: string; // official site / repo
  description: string; // curated, 1–2 sentences
  category: string; // Category.id
  subcategory?: string;
  tags: string[];
  badges: Badge[];
  icon?: string; // path to custom icon asset; fallback = generic
  featured?: boolean;
  price?: Price;
};

export type Category = {
  id: string;
  name: string;
  icon: string; // emoji glyph
  color: string; // CSS color (var) for the folder
  subcategories?: string[];
  order: number; // desktop layout order
};

/** Lightweight runtime validation so bad data fails loud at build/load. */
export function isApp(value: unknown): value is App {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.url === "string" &&
    typeof v.description === "string" &&
    typeof v.category === "string" &&
    Array.isArray(v.tags) &&
    Array.isArray(v.badges)
  );
}
