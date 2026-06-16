# Lookout — Design Doc

> A playful, interactive way to discover the best apps & utilities for your Mac,
> wrapped in a colorful retro-Apple (1984–2001) aesthetic.
>
> **Name:** *Lookout* — a lookout is the high spot you climb to *to spot what's
> worth seeing*. Tagline: *"Spot the best for your Mac."*
> **Status:** Pre-build spec · **Last updated:** 2026-06-16

---

## 1. The Idea

The "awesome-mac" lists ([jaywcjlove/awesome-mac](https://github.com/jaywcjlove/awesome-mac),
[OlixIgnacious/awesome-macOS](https://github.com/OlixIgnacious/awesome-macOS)) are
incredible *content* trapped in a joyless format: thousands of apps as nested
markdown bullets. Valuable, but nobody *enjoys* browsing them.

**We take that same curated content and make discovery delightful.** A faux
classic Macintosh desktop you can actually poke at: categories are "folders" that
open into Finder-style windows, apps are draggable icons, and every interaction
has personality. Retro on the surface, genuinely useful underneath.

### Goals
- Make finding a great Mac app feel like *play*, not research.
- Nail a colorful retro-Apple look (six-color rainbow, candy translucents, pixel
  icons, bold poster type, beveled chrome) — see §5.
- Be a great home for lots of hand-designed animations (author: **you**).
- Stay fast and fully static — deployable anywhere (GitHub Pages / Netlify / Vercel).

### Non-goals (v1)
- No accounts, login, or backend server.
- No live data sync from the source repos (we curate a static dataset — see §4).
- No app installs / payments / affiliate flow (can come later).
- Not a 1:1 mirror of all ~1,200 apps on day one — quality over completeness.

---

## 2. Target Experience

The signature interaction is a **Finder-style desktop**:

- Boot into a faux classic Mac desktop with a **menu bar** (☰ / File / Edit / View /
  Special) and a **desktop surface** with category "folders."
- **Double-click a category folder** → it opens (with a zoom-rect animation) into a
  **window** listing that category's apps as icons.
- **Double-click an app icon** → an **"info" window** (Get Info style) with the app's
  description, badges (open-source / freeware / App Store / native), tags, and a
  link to the real site.
- Windows are **draggable, stackable, closable** — multiple can be open at once.
- A **trash can, clock, and About this Macintosh** dialog for flavor.
- **Search** via a "Sherlock"-style find window (filter by name/tag/category).

### Discovery hooks (make it more than a list)
- **"Surprise Me"** — opens a random app's info window (Special menu).
- **Tag filtering** — click a tag in an info window to find similar apps.
- **Featured / Staff Picks** — a few curated standouts get special icon treatment.
- (Stretch) **Chooser wizard** — "What do you need?" → animated reveal of matches.

---

## 3. Tech Stack

| Concern         | Choice                          | Why |
|-----------------|---------------------------------|-----|
| Framework       | **React + TypeScript**          | Matches your Nook project; great component model for windows/icons. |
| Build/dev       | **Vite**                        | Fast HMR, trivial static build. |
| Animation       | **Framer Motion** (+ hand-authored CSS) | Declarative window/zoom/drag animations; leaves room for your custom work. |
| Window dragging | Framer Motion `drag` or `@use-gesture` | Draggable, bring-to-front windows. |
| State           | **Zustand** (lightweight)       | Track open windows, z-order, focus, search — no Redux overhead. |
| Styling         | **CSS Modules** or vanilla CSS + design tokens | Pixel-precise retro chrome; tokens for the System palette. |
| Data            | **Static typed JSON** (see §4)  | No backend; bundled or fetched at runtime. |
| Fonts           | Chicago / Geneva-style web font (e.g. ChiKareGo, Sysfont, or "FindersKeepers") | The look lives or dies on the typeface. License-check before shipping. |
| Deploy          | Static host (Pages/Netlify/Vercel) | It's a static SPA. |

> Open question: confirm font licensing for any Chicago-style face we bundle.

---

## 4. Data Model

**Source of truth:** a hand-curated, typed JSON dataset we own. We parse the
awesome lists **once** into clean JSON, then enrich (better descriptions, icons,
tags, "featured" flags). Source data is sparse — name, link, ~1 line, a few badges —
so curation is where the quality comes from.

### Entities

```ts
type App = {
  id: string;              // slug, stable
  name: string;
  url: string;             // official site / repo
  description: string;     // curated, 1–2 sentences
  category: string;        // category id
  subcategory?: string;
  tags: string[];          // for filtering / "similar"
  badges: Badge[];         // see below
  icon?: string;           // path to custom icon asset (fallback = generic)
  featured?: boolean;      // staff pick treatment
  price?: 'free' | 'freemium' | 'paid' | 'open-source';
};

type Badge = 'open-source' | 'freeware' | 'app-store' | 'native';

type Category = {
  id: string;
  name: string;            // "Developer Tools"
  icon: string;            // folder icon variant
  subcategories?: string[];
  order: number;           // desktop layout order
};
```

### Categories

**v1 lineup (locked — 8 categories, ~150–250 curated apps):**
1. Developer Tools
2. Utilities
3. Design & Product
4. Reading & Writing
5. AI Tools
6. Audio & Video
7. Browsers
8. Security

**Remaining categories (v2+, seeded from awesome-mac's 25 groups):**
Communication · Data Recovery · Downloads · Cloud Storage · Input Methods ·
Voice-to-Text · Translation · Education · Finance · Encryption · Proxy & VPN ·
Gaming · Remote Login · QuickLook Plugins · App Markets · Download Sites · Podcasts

### Build-time pipeline (one-off, re-runnable)
1. `scripts/parse-awesome.ts` — fetch the source README(s), parse entries
   (name, url, description, badges) into `data/raw.json`.
2. Manual/assisted curation pass → `data/apps.json` (the shipped dataset).
3. Validate against the `App` schema at build time (fail loud on bad data).

---

## 5. Visual Design — Colorful Retro Apple (1984–2001)

> **Reference images:** in `/design-refs/`. The refs establish the real direction:
> the **six-color rainbow Apple logo**, **translucent candy-colored iMac G3s**
> (Bondi blue, tangerine, grape, lime, strawberry), **bold poster typography**
> ("CREATIVE MODE" switch poster), and **chunky 90s pixel icons** (the floppy/CD/
> trash/globe set). So this is NOT austere grayscale System 7 — it's *playful,
> saturated, Y2K Apple*.

### Direction
A retro-Mac desktop **structure** (windows, menu bar, pixel icons, draggable
chrome) but rendered in a **bright, candy, six-color palette** — pixel-crisp
where it counts, glossy/translucent where the iMac era calls for it.

### Palette (starting point — refine from refs)
- **Six-color rainbow** as the signature accent set (green, yellow, orange, red,
  purple, blue) — used for category coding, the logo, hover states, dividers.
- **iMac candy translucents** for surfaces/highlights — Bondi blue, tangerine,
  grape, lime, strawberry; glossy with subtle transparency.
- **Bold poster blocks** (à la the CREATIVE MODE ref): big flat color fields +
  heavy type for hero/empty/loading states.
- **Neutral base**: warm off-white "paper" (`#f4f1e8`-ish from the refs), not pure
  white; black 1px linework for crisp pixel chrome.

### Chrome details to honor
- **Title bars** with pinstripe lines + a square close box (top-left) and zoom box —
  but colorways can use the candy/rainbow accents, not just gray.
- **Chunky pixel icons** in the 90s style (folders, floppy, CD, trash, globe-with-
  magnifier for search) — your hand-drawn set.
- **Beveled buttons** (default button gets the thick rounded outline).
- **Scrollbars** with arrow boxes; can carry a candy tint.
- **Pixel-crisp** edges where it's pixel art; **glossy/translucent** where it's
  iMac-era plastic. Avoid soft modern blur shadows — keep hard offsets.
- **Menu bar** across the top with the rainbow Apple/☰ menu.
- **Bold display typeface** for headings (poster energy) + a Chicago/Geneva-style
  face for UI chrome.

### Motion (you design the set; we wire the hooks)
- **Window open/close:** classic expanding/collapsing "zoom rectangle" wireframe.
- **Folder → window** open transition.
- **Icon hover / select** (invert or highlight).
- **Drag** with subtle lift.
- **Boot sequence** (optional): happy Mac / "Welcome to Macintosh" splash.
- Provide a `prefers-reduced-motion` path.

---

## 6. Architecture / Component Sketch

```
src/
  main.tsx
  App.tsx
  store/                 # zustand: windows, focus, z-order, search
    useDesktop.ts
  components/
    Desktop.tsx          # surface + wallpaper pattern
    MenuBar.tsx          # top menu (Apple/File/Edit/View/Special)
    Icon.tsx             # draggable folder/app icon
    Window.tsx           # generic draggable window shell (title bar, close, zoom)
    windows/
      CategoryWindow.tsx # list of app icons for a category
      AppInfoWindow.tsx  # "Get Info" detail view
      FindWindow.tsx     # Sherlock-style search
      AboutWindow.tsx    # About this Macintosh
    chrome/
      TitleBar.tsx
      Button.tsx         # beveled retro button
      Scrollbar.tsx
  data/
    apps.json
    categories.json
  lib/
    schema.ts            # App/Category types + validation
    search.ts
  styles/
    tokens.css           # System palette + metrics
    patterns.css         # pinstripe / dither backgrounds
scripts/
  parse-awesome.ts       # build-time data pipeline
design-refs/             # your reference images
```

### State (Zustand) shape
- `openWindows: WindowInstance[]` (id, kind, payload, x/y, z)
- `focusedId`, `bringToFront(id)`, `openWindow(...)`, `closeWindow(id)`
- `query`, `filters` for search

---

## 7. Build Plan (phased)

**Phase 0 — Scaffolding**
- Vite + React + TS project, lint/format, deploy target wired.
- Design tokens (`tokens.css`) + pinstripe/dither patterns from your refs.

**Phase 1 — Retro chrome kit** *(desktop)*
- `Window` shell (drag, focus, close/zoom), `TitleBar`, `Button`, `Scrollbar`, `Icon`.
- `Desktop` + `MenuBar`. Static, no data yet. *Goal: it LOOKS like colorful retro Apple.*

**Phase 2 — Data pipeline**
- `parse-awesome.ts` → raw JSON. Define schema + validation.
- Hand-curate the v1 subset (8 categories, see §4) into `apps.json`/`categories.json`.

**Phase 3 — Core experience**
- Category folders on desktop → open `CategoryWindow` → open `AppInfoWindow`.
- Wire Zustand window manager (multi-window, z-order, focus).

**Phase 4 — Discovery & search**
- `FindWindow` (filter by name/tag/category), "Surprise Me", tag → similar.
- Featured / staff-pick treatment.

**Phase 5 — Animation polish**
- Wire your custom motion set: zoom-rect open/close, boot splash, hovers, drag lift.
- `prefers-reduced-motion` fallback.

**Phase 6 — Ship (desktop)**
- Perf pass, favicon/meta, attribution/credits window, deploy. Desktop experience
  is the v1 release.

**Phase 7 — Mobile (post-v1)**
- Simplified mobile mode (the desktop metaphor doesn't fit small screens) —
  likely a single-column browse/list view sharing the same data + visual language.

---

## 8. Open Questions
- ~~**Name**~~ — resolved: **Lookout**.
- ~~**Scope of v1**~~ — resolved: 8 categories (see §4).
- ~~**Mobile**~~ — resolved: **desktop-first for v1**. The full desktop metaphor
  ships first; a simplified mobile mode comes in a later phase (see §7, Phase 7).
- **Font** — which Chicago-style web font, and is its license OK to ship?
- **Attribution** — credit the source awesome lists (their licenses; likely CC/MIT) —
  confirm and add a credits window.

---

## 9. Stretch / Future
- Chooser-style "what do you need?" recommendation wizard.
- Shareable deep links to a specific app/category window state.
- User favorites (localStorage "Stickies").
- Sound effects (classic Mac beep/chime) with a mute toggle.
- Community submissions / "submit an app" flow (would need a backend).
- Live re-sync from source repos as an optional data mode.
