// Build-time importer: parse the awesome-mac README into Lookout's dataset.
// Run: node scripts/parse-awesome.mjs
// Writes src/data/apps.json and src/data/categories.json.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "src", "data");
const SOURCE =
  "https://raw.githubusercontent.com/jaywcjlove/awesome-mac/master/README.md";

// Headings that are not app categories.
const SKIP = [
  "table of contents", "contributing", "license", "backers", "sponsor",
  "sponsors", "related", "awesome", "contributors", "contact", "acknowled",
  "thanks", "other", "what is", "how to", "legend", "the icons",
];

const COLORS = [
  "var(--imac-bondi)", "var(--imac-tangerine)", "var(--imac-strawberry)",
  "var(--imac-grape)", "var(--imac-lime)", "var(--six-red)", "var(--six-blue)",
  "var(--six-purple)", "var(--six-green)", "var(--six-orange)",
];

const GLYPHS = [
  [/develop|api|version control|virtual|database|terminal|framework|regular expr/, "🛠"],
  [/editor|text|writ|read|markdown|journal|ebook|book/, "✍️"],
  [/office|productiv|to-?do|note/, "🗒"],
  [/design|prototyp|mind|screenshot|screen record/, "🎨"],
  [/\bai\b|machine learning/, "🤖"],
  [/communication|collab|team|email|mail|chat|file sharing/, "✉️"],
  [/recovery/, "🛟"],
  [/audio|video|music|media/, "🎬"],
  [/download/, "⬇️"],
  [/cloud|storage/, "☁️"],
  [/input method/, "⌨️"],
  [/voice|speech/, "🎙"],
  [/browser/, "🌐"],
  [/translat/, "🌍"],
  [/education/, "🎓"],
  [/finance/, "💰"],
  [/encrypt/, "🔐"],
  [/security/, "🔒"],
  [/proxy|vpn/, "🛡"],
  [/gam/, "🎮"],
  [/remote/, "🖥"],
  [/quicklook/, "👁"],
  [/market|app.*download|download.*site|store/, "🛍"],
  [/podcast/, "🎧"],
  [/clipboard/, "📋"],
  [/menu ?bar/, "📊"],
  [/window/, "🪟"],
  [/password/, "🔑"],
  [/finder|file/, "📁"],
  [/util/, "🧰"],
];

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cleanHeading = (s) =>
  s
    .replace(/\[!\[[^\]]*\]\[[^\]]*\]\]\([^)]*\)/g, "") // [![alt][ref]](url)
    .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "") // [![alt](src)](url)
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, "") // ![alt][ref]
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // ![alt](src)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url) -> text
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1") // [text][ref] -> text
    .replace(/[#*`]/g, "")
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const glyphFor = (name) => {
  const n = name.toLowerCase();
  for (const [re, g] of GLYPHS) if (re.test(n)) return g;
  return "📁";
};

const res = await fetch(SOURCE);
if (!res.ok) {
  console.error("Failed to fetch README:", res.status);
  process.exit(1);
}
const md = await res.text();
const lines = md.split("\n");

const apps = [];
const ids = new Set();
let category = null; // {id,name}
let subcategory = null;
let skipping = true;

const uniqueId = (base) => {
  let id = base || "app";
  let i = 2;
  while (ids.has(id)) id = `${base}-${i++}`;
  ids.add(id);
  return id;
};

for (const raw of lines) {
  const line = raw.replace(/\r$/, "");

  const h2 = line.match(/^##\s+(.+)/);
  const h34 = line.match(/^###+\s+(.+)/);
  if (h2) {
    const name = cleanHeading(h2[1]);
    const low = name.toLowerCase();
    skipping = SKIP.some((s) => low.includes(s)) || name.length === 0;
    category = skipping ? null : { id: slug(name), name };
    subcategory = null;
    continue;
  }
  if (h34) {
    subcategory = category ? cleanHeading(h34[1]) : null;
    continue;
  }

  if (skipping || !category) continue;
  if (!/^\s*[*-]\s+/.test(line)) continue;

  // first non-image, non-anchor markdown link
  const linkRe = /(?<!!)\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g;
  let m;
  let name = null;
  let url = null;
  let endIdx = 0;
  while ((m = linkRe.exec(line))) {
    const u = m[2].trim();
    if (u.startsWith("#")) continue; // table-of-contents anchor
    name = m[1].replace(/[*`]/g, "").trim();
    url = u;
    endIdx = m.index + m[0].length;
    break;
  }
  if (!name || !url) continue;

  let desc = line
    .slice(endIdx)
    .replace(/\[!\[[^\]]*\]\[[^\]]*\]\]\([^)]*\)/g, "") // [![alt][ref]](url)
    .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "") // [![alt](src)](url)
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, "") // ![alt][ref]
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // ![alt](src)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) -> text (incl empty)
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1") // [text][ref] -> text
    .replace(/\((?:https?:)?\/\/[^)]*\)/g, "") // stray (url)
    .replace(/[*`[\]]/g, "") // leftover emphasis / brackets
    .replace(/^\s*[-–—:]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (desc.length > 240) desc = desc.slice(0, 237).trimEnd() + "…";

  const badges = [];
  if (/open[- ]source/i.test(line) || /\bOSS\b/.test(line)) badges.push("open-source");
  if (/freeware/i.test(line)) badges.push("freeware");
  if (/apps\.apple\.com/i.test(line) || /app-store/i.test(line)) badges.push("app-store");

  const price = badges.includes("open-source")
    ? "open-source"
    : badges.includes("freeware")
      ? "free"
      : undefined;

  apps.push({
    id: uniqueId(slug(name)),
    name,
    url,
    description: desc,
    category: category.id,
    ...(subcategory ? { subcategory } : {}),
    tags: subcategory ? [subcategory.toLowerCase()] : [],
    badges,
    ...(price ? { price } : {}),
  });
}

// Build category list in order of first appearance, only those with apps.
const order = [];
const seen = new Map();
for (const a of apps) {
  if (!seen.has(a.category)) {
    seen.set(a.category, true);
    order.push(a.category);
  }
}
// recover display names from headings we captured (re-scan)
const nameById = {};
{
  let cur = null, skip = true;
  for (const raw of lines) {
    const h = raw.match(/^##\s+(.+)/);
    if (!h) continue;
    const nm = cleanHeading(h[1]);
    const low = nm.toLowerCase();
    skip = SKIP.some((s) => low.includes(s)) || !nm;
    if (!skip) nameById[slug(nm)] = nm;
    cur = nm;
  }
  void cur;
}

const categories = order.map((id, i) => ({
  id,
  name: nameById[id] ?? id,
  icon: glyphFor(nameById[id] ?? id),
  color: COLORS[i % COLORS.length],
  order: i + 1,
  subcategories: [
    ...new Set(apps.filter((a) => a.category === id && a.subcategory).map((a) => a.subcategory)),
  ],
}));

writeFileSync(join(DATA, "apps.json"), JSON.stringify(apps, null, 2) + "\n");
writeFileSync(join(DATA, "categories.json"), JSON.stringify(categories, null, 2) + "\n");

console.log(`Parsed ${apps.length} apps across ${categories.length} categories.`);
console.log(categories.map((c) => `  ${c.icon} ${c.name} (${apps.filter((a) => a.category === c.id).length})`).join("\n"));
