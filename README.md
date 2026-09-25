# Siam Hossain — Portfolio

A fast, recruiter-friendly personal portfolio for **Siam Hossain** — a Computer Science
student and full-stack / AI developer. It's a **static site built with plain HTML, CSS, and
JavaScript** — no framework, no build step, no dependencies.

> **Design goal:** a recruiter or hiring manager should grasp *who I am, what I do, and my
> level* within ~5 seconds, and the site should be comfortable to read on any device.

🌐 **Live:** <https://alphaman-0.github.io/AboutMe/>

---

## ✨ Highlights

- **Light + dark "spec sheet" theme** — a warm-stone datasheet with 1px hairlines, two
  themes (light and dark), and a `prefers-color-scheme`-aware reveal transition when you
  toggle.
- **The 5-second scan** — the hero is a *5-cell spec card* (NOW · EDUCATION · FLAGSHIP ·
  CORE STACK · PRACTICE) — no critical copy is hidden behind scroll animations.
- **Bento-grid work grid** — featured projects are laid out as a bento with 1px hairline
  dividers (the visual signature of the design). A **filter** and **Grid / Index** switch
  reshape it; state is kept in the URL so any view is shareable.
- **Six standalone case-study pages** for selected projects (POS, e-commerce,
  AIUB Notice Bot, websites, AI development, and a scroll-animation experiment), all
  sharing the same top bar, reading-progress strip, and ⌘K command menu.
- **AIUB Notice Bot 5-stage pipeline** with an animated packet (Web Animations API) that
  fires on scroll-in and can be replayed — mock Telegram UI, KPI strip, and an inline
  SVG architecture diagram.
- **Skill evidence popovers** — every chip in the skills grid has a one-tap evidence
  popover (using the Popover API + anchor positioning) so claims are *anchored* in real
  artifacts.
- **⌘K command menu** — a keyboard-driven `<dialog>` command palette for jumping to any
  section, page, or external link.
- **Live Dhaka clock** in the top bar (a small, honest signal that this is a real
  personal site).
- **Mobile-first & accessible** — hamburger nav, phone action bar, WCAG-AA contrast, a
  skip-to-content link, visible `:focus-visible` outlines, and `prefers-reduced-motion`
  support throughout.

---

## 🗂 Project structure

```
AboutMe/
├── index.html          # Main single-page portfolio (the hub)
│                        #   Top bar · Hero spec sheet · #work · #experience
│                        #   · #skills · #practice · #about · #contact
│
├── pos.html            # Case study — Pharmacy POS (interactive screenshot gallery)
├── ecommerce.html      # Case study — MegaBazar (2 galleries, MegaBazar + ShoeVista)
├── automation.html     # Case study — AIUB Notice Bot (pipeline · Telegram mock · diagram)
├── websites.html       # Case study — private business tools (stock audit + invoicing)
├── ai-dev.html         # Case study — AI Integration & Development
├── wpdev.html          # Case study — Scroll Animation (self-contained, scroll-linked canvas)
│
├── css/
│   └── style.css       # Single stylesheet — tokens (light + dark) + all shared components
├── js/
│   └── script.js       # Guarded modules: theme, active-nav, work filter, evidence popovers,
│                        #   ⌘K, action bar, live clock, platform stats, galleries, pipeline
│
├── images/
│   ├── favicon.svg                  # Site favicon (used by every page)
│   ├── logo.svg                     # Top-bar monogram
│   ├── siam-headshot.jpg            # About photo + social-share image
│   ├── ai-resume-builder-preview.png
│   ├── automation-logo.svg          # AIUB Notice Bot hero logo
│   ├── automation-thumb.svg         # Automation card thumbnail (on index.html)
│   ├── audit/                       # Stock-audit tool screenshots (websites case study)
│   ├── invoice/                     # Invoice-generator screenshots (websites case study)
│   ├── pos/                         # POS screenshots (case study + hub card)
│   └── MegaBazar/                   # MegaBazar hero + screenshots (ecommerce case study)
│
├── MegaBazar/          # E-commerce case-study screenshots
├── parmacyShop/        # Pharmacy POS case-study screenshots (Nasema Pharmacy)
├── Animation/          # 52-frame PNG sequence for the scroll-animation page
│
├── Siam-Hossain-CV.pdf # CV — linked from the header, hero, and contact section
├── .claude/
│   ├── server.mjs      # Tiny Node static file server (port 8765, path-traversal guarded)
│   └── launch.json     # Debug/launch config for the static server
└── README.md
```

---

## 📄 The pages

### `index.html` — the hub

A single page of anchor-scrolled sections, with a sticky top bar (monogram · name ·
primary nav · ⌘K button · "Open to opportunities" status pill · **Download CV** · theme
toggle · hamburger):

| # | Section | What's in it |
|---|---------|--------------|
| — | **Hero spec sheet** | 7/5-column split — name, role, short pitch + CV/email CTAs on the left; a 5-cell spec `<dl>` (NOW · EDUCATION · FLAGSHIP · CORE STACK · PRACTICE) on the right. Below: the AIUB Notice Bot 5-stage pipeline with a replayable packet. |
| 01 | **#work** | Featured bento of project cards (POS, AIUB Bot, E-commerce, AI tools, websites). A **filter** switch (All · Personal · Production · School) and a **Grid / Index** view, both encoded in the URL. |
| 02 | **#experience** | Year ruler with events plotted across 2023–2026, including the "First paid client · 2025" milestone. |
| 03 | **#skills** | 3×3 bento (Frontend · Backend · Languages · Database · AI / ML · DevOps · Tools · CS Fundamentals · Practice). Each chip carries `data-evidence` — click to open a Popover-API popover with concrete artifacts. |
| 04 | **#practice** | Codolio "2000+" hero with the live-stat cards, a **ledger table** (LeetCode 303 · Codeforces 318 · HackerRank 63), and a "How I build with AI" breakdown of the three tools (Claude Code, Cursor, GitHub Copilot) plus a six-topic **AI learning** progress block (`#ai-learning`). |
| 05 | **#about** | Portrait + short bio. |
| 06 | **#contact** | Email + CV CTAs and social links, on an inverse tile. |

A `phone action bar` (sticky bottom) keeps contact one tap away on mobile. A `reading
progress bar` sits across the top of every case-study page.

### The six case-study pages

| Page | Project | Notes |
|------|---------|-------|
| `pos.html` | **Pharmacy POS** (Nasema Pharmacy) | Interactive screenshot gallery — cashier + manager tabs, prev/next, arrow-key + swipe nav, image preloading. |
| `ecommerce.html` | **E-Commerce** (MegaBazar + ShoeVista) | Two galleries on one page; MegaBazar has 8 screens, ShoeVista shows designed placeholders. |
| `automation.html` | **AIUB Notice Bot** | Flagship automation case study — serverless Telegram bot on GitHub Actions, scrapes + AI-classifies + pushes university notices. Mock Telegram UI, KPI strip, 4-step pipeline, and an inline SVG architecture diagram. |
| `websites.html` | **Websites** (private builds) | Two free, password-gated tools for friends' businesses — Google-Sheets stock-audit app + multi-business invoice generator. Previews shown instead of public links to protect business data. |
| `ai-dev.html` | **AI Integration & Development** | Three AI projects — an ATS résumé builder (live demo), LLM agents + RAG, and Selenium scraping. "Currently learning" block deep-links to `index.html#practice#ai-learning`. |
| `wpdev.html` | **Scroll Animation** | A self-contained scroll-linked HTML5 `<canvas>` painting a 52-frame PNG sequence across a 400vh runway, with fading text overlays. Theme-aware fog. Reduced-motion fallback uses 4 hand-picked frames. |

Each case-study page has a unified top bar that links back to `index.html#work`.

---

## 🎨 Design system

All design tokens live in `:root` at the top of `css/style.css`, with a mirror set under
`[data-theme="dark"]` and a `prefers-color-scheme`-aware reveal transition on toggle.

| Token            | Light     | Dark      | Use                                |
|------------------|-----------|-----------|------------------------------------|
| `--tile`         | `#F2F0EA` | `#131311` | Page background (warm stone / ink) |
| `--tile-2`       | `#FBFAF7` | `#191917` | Cards / raised surfaces            |
| `--surface`      | `#FFFFFF` | `#1B1B18` | Higher surfaces (dialog, popover)  |
| `--surface-2`    | `#F4F2EC` | `#1F1F1C` | Subtle fills (chips, thumbnails)   |
| `--ink`          | `#18191C` | `#F1EFE9` | Headings / primary text            |
| `--ink-2`        | `#45474D` | `#B6B3A9` | Secondary body text                |
| `--ink-3`        | `#6B6E76` | `#7E7B72` | Muted labels / metadata            |
| `--rule`         | `#E7E4DD` | `#2A2A26` | Hairlines (1px bento dividers)     |
| `--accent`       | `#1F44E0` | `#7B97FF` | Cobalt — links, active state, CTAs |
| `--accent-deep`  | `#13245C` | `#B3C2FF` | Strong accents / hovers            |
| `--ok`           | `#1A8F4C` | `#7BD49A` | "Open to opportunities" status     |

Layout scales fluidly via `clamp()` (`--maxw: 1180px`, `--pad: clamp(20px, 5vw, 64px)`),
with responsive breakpoints around **920px** (tablet: nav collapses to a hamburger,
grids go 2-column) and **600px** (mobile: single column, action bar appears).

**Typography** (Google Fonts):

- **Fraunces** — display serif (variable `opsz`/`wght`), used for the name and section
  headings. Italic for emphasis; a `@supports (animation-timeline: view())` rule
  "settles" Fraunces' weight from 380 → 500 as you scroll past `<h2>`s where supported.
- **Hanken Grotesk** — body & UI sans; carries all scan-critical text (fastest to read).
- **IBM Plex Mono** — small uppercase labels, metadata, and numbers (the "engineer"
  signal).

The theme toggle animates with the **View Transitions API** — when supported, the page
fades into a soft circle reveal that follows your click.

---

## 🧠 JavaScript (`js/script.js`)

A single ES module-ish file split into **guarded IIFEs** — each one early-returns when
its target nodes aren't on the page, so the same file works on every page without the
hub needing the case-study modules or vice versa.

- **Bootstrap** — runs `localStorage.removeItem('hackerMode')` + `'booted'` once, then
  applies the persisted theme. Theme reads happen *before paint* via a tiny inline
  script in each page `<head>`; the full toggle lives here.
- **Theme toggle** — sets `data-theme` on `<html>`, persists choice, and animates with
  View Transitions (circle reveal from the click point).
- **Active nav + sliding indicator** — `IntersectionObserver` marks the current section;
  the top-bar nav gets a sliding underline indicator.
- **Top bar scroll state** — adds `.is-scrolled` when the user scrolls past ~32px.
- **Mobile nav** — hamburger toggles the panel (`data-open` / `aria-expanded`),
  closes on link click or `Escape`.
- **Copy email** — the "Copy" pills use `navigator.clipboard.writeText` with an
  `aria-live` toast.
- **Action bar** — sticky-bottom phone contact strip with a fade-in once the contact
  section leaves the viewport.
- **Live Dhaka clock** — every-minute tick in the hero, formatted in `en-GB`.
- **Work filter + Grid / Index switch** — toggles cards by category and switches the
  layout between a bento and a numbered index. State is mirrored to the URL
  (`?filter=production&view=index`) so any view is shareable. Filter changes animate
  through View Transitions where available.
- **Skill evidence popovers** — a click on any `[data-evidence]` chip toggles the
  matching Popover API element via `popoverTargetAction`; popovers anchor to their
  trigger and dismiss on outside-click / `Escape`.
- **Pipeline** (AIUB Notice Bot) — paints a packet along the 5-stage pipeline with
  Web Animations API, supports Pause + Replay, and uses roving `tabindex` for
  keyboard control.
- **Live competitive-programming stats** (`Promise.allSettled`, each fetch behind an
  `AbortController` timeout):
  - **LeetCode** — via the public `alfa-leetcode-api.onrender.com` proxy.
  - **Codeforces** — via the official, CORS-enabled Codeforces API (counts unique
    solved).
  - **HackerRank** — no public CORS API, so it's routed through `corsproxy.io`; the
    card also has a **hardcoded fallback value** so it always renders even if the
    proxy is unavailable.
  - **Codolio** — shown as the aggregate "total" (hardcoded; no public API).
  - Each `.ps-card[data-platform]` carries a `.ps-stat-num` / `.ps-stat-label` pair
    the fetcher updates.
- **Galleries** (`pos.html`, `ecommerce.html`, `wpdev.html`) — one engine, three
  variants. Tracks active index, updates `[data-counter]`, supports prev/next buttons
  + arrow keys + swipe on touch; preloads neighbor images.
- **Cross-document View Transitions** — case-study cards use `view-transition-name`
  to morph into the target page's hero image where supported.
- **Reveals** — content fades up via an `IntersectionObserver` that adds `.in`. All
  motion gates off `prefers-reduced-motion: reduce`.

If any fetch fails, the **hardcoded counts in the HTML stay as the reliable
fallback** (currently LeetCode `303`, Codeforces `318`, HackerRank `63`,
Codolio `2000+`).

> `wpdev.html` has its own self-contained script (separate from `js/script.js`) that
> paints the 52-frame sequence to a `<canvas>` driven by scroll position.

---

## 🔌 Asset wiring (which page uses what)

| Page | `css/style.css` | Inline `<style>` | `js/script.js` | Other |
|------|:---:|:---:|:---:|-------|
| `index.html` | ✅ | minimal | ✅ | JSON-LD `<script type="application/ld+json">` block |
| `pos.html` | ✅ | minimal | ✅ | + inline `<script>` (gallery engine) |
| `ecommerce.html` | ✅ | minimal | ✅ | + inline `<script>` (gallery engine) |
| `automation.html` | ✅ | minimal | ✅ | inline SVG architecture diagram |
| `ai-dev.html` | ✅ | minimal | ✅ | — |
| `websites.html` | ✅ | minimal | ✅ | — |
| `wpdev.html` | ✅ | redeclares tokens as fallback | — | **own inline `<script>`** for the 52-frame canvas |

All seven pages load the three Google Fonts and use `images/favicon.svg`.

---

## 🚀 Run locally

No build step. Either open `index.html` directly, or (recommended, so the live-stats
fetches and asset paths behave correctly) serve it over HTTP:

```bash
node .claude/server.mjs
# → http://127.0.0.1:8765
```

Any static server works too, e.g. `python3 -m http.server 8765`.

---

## 🌐 Deploy

It's a static site — host the repo root on **GitHub Pages** (already live at
<https://alphaman-0.github.io/AboutMe/>), or any static host (Netlify / Vercel /
etc.). No configuration required.

---

## ✅ To personalize

- [ ] **Confirm the Experience dates & bullets** in `index.html` before publishing
      updates.
- [ ] **Swap the live-stats fallback numbers** in `index.html` if the APIs are
      unreachable and you want the cards to show current values.
- [ ] *(Optional)* Replace the `Animation/` frame sequence on `wpdev.html` with your
      own work.
- [ ] *(Optional)* Fill the `images/audit/*.png` and `images/invoice/*.png` placeholders
      in `websites.html` when the previews are ready.
- [ ] **Regenerate `Siam-Hossain-CV.pdf`** to mirror the new "AI Engineering" learning
      section on the site — add a new "Currently Learning" subsection listing the six
      topics (LLM fundamentals, RAG, AI agents, prompt engineering, vector databases,
      evaluation & safety) and update the top summary line to mention AI engineering.

**Housekeeping notes:**

- The `parmacyShop/` folder is a cosmetic misspelling of "pharmacy" — harmless, since
  the image paths reference it consistently.

---

## 🔗 Links

- GitHub — [@ALPHAMAN-0](https://github.com/ALPHAMAN-0)
- LinkedIn — [in/siamhossain4](https://www.linkedin.com/in/siamhossain4/)
- X — [@SIAM_HOSSAIN47](https://x.com/SIAM_HOSSAIN47) · Facebook —
  [/SiamHossin11](https://www.facebook.com/SiamHossin11/)
- LeetCode — [RedApple47](https://leetcode.com/u/RedApple47/) · Codeforces —
  [SIAM001](https://codeforces.com/profile/SIAM001) · HackerRank —
  [BaBaYaGa_A1](https://www.hackerrank.com/profile/BaBaYaGa_A1) · Codolio —
  [babaYagaa](https://codolio.com/profile/babaYagaa)
- Email — <siam.cse.aiub@gmail.com>

---

## 🛠 Tech

HTML5 · CSS3 (custom properties, Grid/Flexbox, `clamp()`, View Transitions,
`@supports (animation-timeline: view())`) · vanilla JavaScript (ES6+,
`IntersectionObserver` + Fetch + Web Animations + Popover API) ·
Fraunces + Hanken Grotesk + IBM Plex Mono.
