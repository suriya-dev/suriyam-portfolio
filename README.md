# Suriya M · Senior Frontend Engineer — Portfolio (Angular)

A dark-mode (with **light mode toggle**) split-screen portfolio landing page built with **Angular 20** (standalone components, new control-flow `@for`/`@if`, Signals). It recreates a polished senior-frontend hero scene with a live **"Micro-Frontend Architecture" network animation**, a glowing **tech-stack carousel** (now incl. **React**), a **hide/show menu bar**, and a dedicated **R&D / experiments section** for a senior 5-year frontend seat.

## ✨ Highlights

- **Theme toggle (dark ⇄ light)** — deep-blue/charcoal dark theme and a clean light theme, driven by semantic CSS variables. Persists to `localStorage` and respects `prefers-color-scheme`.
- **Hide/show menu bar** — a fixed top nav with a hamburger that collapses/expands the menu (works on desktop *and* mobile dropdown). Auto-closes on navigation.
- **Font Awesome 6 Free icons** — pre-loaded as inline SVG (no CDN dependency) for the top menu, the left icon rail, and the project cards.
- **Split-screen layout** — floating vertical icon rail on the left (Home / Skills / Projects / R&D / Contact) with glowing icons + tooltips.
- **Hero** — large gradient typography **"SURIYA M // SENIOR FRONTEND ENGINEER"**, tagline *"Architecting high-scale banking UIs with Angular & Micro-Frontends"* (+ React).
- **Live canvas animation** — floating morphing polygons (mini-architecture) that **glow as the pointer approaches**.
- **Tech icon carousel**: HTML5, CSS/SCSS, Bootstrap, JavaScript/ES6+, TypeScript, **Angular v14–20 (featured + glow)**, RxJS, Kendo UI, GraphQL, JWT, **React 18**.
- **R&D / Experiments section** — virtual scroll (10k+ rows), **OnPush change-detection strategy + Signals/zoneless**, micro-frontend POC (Native Federation), signal-based state migration, **React × Angular interop (R&D)**, RTL Arabic PDFs.
- **Projects section** — four client cards, each with a Font Awesome icon: **CBDC (HDFC Bank)**, **GIB**, **FAB**, and **Bank ABC**.
- **CTA**: *"[ View My CBDC Project ]"* + Get In Touch.

## ⚙️ Tech

- Angular 20 (standalone, no NgModules), new control flow, Signals
- Animated canvas (pure 2D) + self-contained inline SVG icons
- SCSS design system with CSS custom properties for both themes

## 🚀 Run it

```bash
npm install
npm start            # or: npx ng serve --port 4200 --host 0.0.0.0
```

Open http://localhost:4200. `angular.json` sets `serve.options.allowedHosts = true` so the sandbox preview host is served.
Production build: `npm run build` (budgets bumped for the larger component styles).

## 📁 Structure

```
src/
├─ main.ts
├─ index.html
├─ styles.scss                 # global design system (dark + light tokens)
└─ app/
   ├─ app.ts / .html / .scss   # shell: top menu bar + sidebar + hero + sections
   ├─ icons.ts                 # Font Awesome 6 Free inline SVG set
   ├─ network-animation/       # canvas micro-frontend network loop
   └─ tech-carousel/           # glowing tech-icon carousel
```

## ✏️ Customise

- **Theme colours**: `src/styles.scss` — `:root` (dark) and `:root[data-theme="light"]`.
- **Menu items / R&D cards**: `src/app/app.ts` → `navItems[]`, `rndItems[]`.
- **Tech icons**: `src/app/tech-carousel/tech-carousel.ts` → `techs[]` (`featured: true` for the pulsing glow ring).
- **Animation**: `src/app/network-animation/network-animation.ts` (count, speed, colour, link distance).
