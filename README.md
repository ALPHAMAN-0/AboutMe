# Siam Hossain — Portfolio

A fast, recruiter-friendly personal portfolio for **Siam Hossain** — a Computer Science
student and full-stack / AI developer. It's a **static site built with plain HTML, CSS, and
JavaScript** — no framework, no build step, no dependencies.

> **Design goal:** a recruiter or hiring manager should grasp *who I am, what I do, and my
> level* within ~5 seconds, and the site should be comfortable to read on any device.

🌐 **Live:** <https://alphaman-0.github.io/AboutMe/>

---

## ✨ Highlights

- **Light, professional "editorial dossier" theme** — warm off-white paper, near-black ink, a
  single confident cobalt accent. Calm and scannable rather than flashy.
- **The 5-second scan** — the hero is a résumé-header *summary card*: role, one-line summary,
  current status, top skills, and a **Download CV** button, all above the fold on desktop and
  mobile. Nothing critical is hidden behind scroll animations.
- **Scannable content** — About, an Experience & education timeline, a categorized skills
  grid, project cards, and a live problem-solving section.
- **Six standalone case-study pages** for selected projects (AI, POS, e-commerce, scroll
  animation, automation, and private business tools), all sharing the light theme and a
  unified top bar.
- **Live competitive-programming stats** — LeetCode and Codeforces solved counts are fetched
  live in the browser; HackerRank is fetched through a CORS proxy with a hardcoded fallback
  (see [JavaScript](#-javascript-jsscriptjs)).
- **Mobile-first & accessible** — responsive layout with a hamburger menu, WCAG-AA contrast,
  a skip-to-content link, visible `:focus-visible` outlines, and `prefers-reduced-motion`
  support.

---

## 🗂 Project structure

```
AboutMe/
├── index.html          # Main single-page portfolio (the hub)
│                        #   About · Experience · Skills · Work · Problem-solving · Contact
│
├── ai-dev.html         # Case study — AI Integration & Development
├── pos.html            # Case study — Pharmacy POS (interactive screenshot gallery)
├── ecommerce.html      # Case study — E-Commerce / MegaBazar (interactive screenshot gallery)
├── wpdev.html          # Case study — Scroll Animation (scroll-linked HTML5 canvas, 52 frames)
├── automation.html     # Case study — AIUB Notice Bot (serverless Telegram automation)
├── websites.html       # Case study — private business tools (stock audit + invoicing)
│
├── css/
│   └── style.css       # Single stylesheet — design tokens + all shared components
├── js/
│   └── script.js       # Active-nav highlight + mobile menu + live competitive-programming stats
│
├── images/
│   ├── favicon.svg                  # Site favicon (used by every page)
│   ├── SIAM.jpeg                    # Portrait (About section) + social-share image
│   ├── ai-resume-builder-preview.png
│   ├── automation-logo.svg          # AIUB Notice Bot hero logo
│   ├── automation-thumb.svg         # Automation card thumbnail (on index.html)
│   └── pos/                         # POS screenshots (admin / manager / cashier)
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

A single page of anchor-scrolled sections, with a sticky top bar (brand · nav · "Open to
opportunities" status pill · **Download CV** · mobile hamburger):

| # | Section | What's in it |
|---|---------|--------------|
| — | **Hero** | Résumé summary card — name, role, one-line pitch, status, core skills, CV + Email CTAs, and a 4-cell quick-facts panel |
| 01 | **About** | Portrait + short bio and quick facts (location, education, focus, languages) |
| 02 | **Experience & education** | Timeline — freelance full-stack work and the BSc CSE @ AIUB |
| 03 | **Skills** | Nine-group grid (Frontend, Backend, Languages, Database, AI/ML, DevOps, Tools, CS fundamentals, Spoken languages) |
| 04 | **Selected work** | Nine project cards — six link to the case-study pages below, three link out to GitHub repos |
| 05 | **Problem solving** | Four live-stat cards (LeetCode · Codeforces · HackerRank · Codolio) |
| 06 | **Contact** | Email + CV CTAs and social links (GitHub, LinkedIn, X, Facebook) |

### The six case-study pages

| Page | Project | Notes |
|------|---------|-------|
| `ai-dev.html` | **AI Integration & Development** | Three AI projects — an ATS résumé builder (live demo), LLM agents + RAG, and Selenium scraping. |
| `pos.html` | **Pharmacy POS** (Nasema Pharmacy) | Interactive screenshot gallery — project/screen tabs, prev/next, arrow-key + swipe nav, image preloading. |
| `ecommerce.html` | **E-Commerce** (MegaBazar) | Same gallery engine as the POS page, sourcing screenshots from `MegaBazar/`. |
| `wpdev.html` | **Scroll Animation** | A scroll-linked HTML5 `<canvas>` painting a 52-frame PNG sequence across a 400vh runway, with fading text overlays. |
| `automation.html` | **AIUB Notice Bot** | Flagship automation case study — a serverless Telegram bot on GitHub Actions that scrapes, AI-classifies and pushes university notices. Includes a mock Telegram UI, KPI strip, four-step pipeline, and an inline SVG architecture diagram. |
| `websites.html` | **Websites** (private builds) | Two free, password-gated tools for friends' businesses — a Google-Sheets stock-audit app and a multi-business invoice generator. Intentionally unlinked for data privacy. |

Each case-study page has a unified top bar that links back to `index.html#work`.

---

## 🎨 Design system

All design tokens live in `:root` at the top of `css/style.css`:

| Token            | Value     | Use                                  |
|------------------|-----------|--------------------------------------|
| `--paper`        | `#FBFAF7` | Page background (warm off-white)     |
| `--surface`      | `#FFFFFF` | Cards / raised surfaces              |
| `--surface-2`    | `#F4F2EC` | Subtle fills (chips, thumbnails)     |
| `--ink`          | `#18191C` | Headings / primary text              |
| `--ink-2`        | `#45474D` | Secondary body text                  |
| `--ink-3`        | `#6B6E76` | Muted labels / metadata              |
| `--rule`         | `#E7E4DD` | Hairline borders                     |
| `--accent`       | `#1F44E0` | Cobalt — links, active state, CTAs   |
| `--accent-deep`  | `#13245C` | Navy — strong accents / hovers       |
| `--ok`           | `#1A8F4C` | "Open to opportunities" status       |

Layout scales fluidly via `clamp()` (`--maxw: 1180px`, `--pad: clamp(20px, 5vw, 64px)`), with
responsive breakpoints around **920px** (tablet: nav collapses to a hamburger, grids go
2-column) and **600px** (mobile: single column). There is **no dark mode**.

**Typography** (Google Fonts):

- **Fraunces** — display serif, used for the name and section headings.
- **Hanken Grotesk** — body & UI sans; carries all scan-critical text (fastest to read).
- **JetBrains Mono** — small uppercase labels, metadata, and numbers (the "engineer" signal).

---

## 🧠 JavaScript (`js/script.js`)

Intentionally minimal — no custom-cursor / parallax / scramble effects. Three small IIFEs:

- **Active-nav highlight** — an `IntersectionObserver` marks the current section in the top
  bar (`aria-current`).
- **Mobile nav** — the hamburger toggles the nav panel (`data-open` / `aria-expanded`) and
  closes on link click or `Escape`.
- **Live problem-solving stats** (`Promise.allSettled`, each fetch behind an
  `AbortController` timeout):
  - **LeetCode** — via the public `alfa-leetcode-api.onrender.com` proxy.
  - **Codeforces** — via the official, CORS-enabled Codeforces API (counts unique solved).
  - **HackerRank** — no public CORS API, so it's routed through `corsproxy.io`; the card also
    has a **hardcoded fallback value** so it always renders even if the proxy is unavailable.
  - **Codolio** — shown as the aggregate "total" (hardcoded; no public API).

If any fetch fails, the **hardcoded counts in the HTML stay as the reliable fallback**
(currently LeetCode `303`, Codeforces `318`, HackerRank `63`, Codolio `2000+`).

> `wpdev.html` has its own self-contained script (separate from `js/script.js`) that paints
> the 52-frame sequence to a `<canvas>` driven by scroll position.

---

## 🔌 Asset wiring (which page uses what)

| Page | `css/style.css` | Inline `<style>` | `js/script.js` | Other |
|------|:---:|:---:|:---:|-------|
| `index.html` | ✅ | — | ✅ | — |
| `ai-dev.html` | ✅ | ✅ | ✅ | — |
| `pos.html` | ✅ | ✅ | ✅ | + inline `<script>` (gallery engine) |
| `ecommerce.html` | ✅ | ✅ | ✅ | + inline `<script>` (gallery engine) |
| `automation.html` | ✅ | ✅ | ✅ | inline SVG architecture diagram |
| `websites.html` | ✅ | ✅ | — | no JS |
| `wpdev.html` | — | ✅ | — | **fully self-contained**: Tailwind CDN + own inline `<script>` |

All seven pages load the three Google Fonts and use `images/favicon.svg`.

---

## 🚀 Run locally

No build step. Either open `index.html` directly, or (recommended, so the live-stats fetches
and asset paths behave correctly) serve it over HTTP:

```bash
node .claude/server.mjs
# → http://127.0.0.1:8765
```

Any static server works too, e.g. `python3 -m http.server 8765`.

---

## 🌐 Deploy

It's a static site — host the repo root on **GitHub Pages** (already live at
<https://alphaman-0.github.io/AboutMe/>), or any static host (Netlify / Vercel / etc.).
No configuration required.

---

## ✅ To personalize

- [ ] **Confirm the Experience dates & bullets** in `index.html` before publishing updates.
- [ ] **Swap the live-stats fallback numbers** in `index.html` if the APIs are unreachable
      and you want the cards to show current values.
- [ ] *(Optional)* Replace the `Animation/` frame sequence on `wpdev.html` with your own work.
- [ ] *(Optional)* Fill the "next automation" placeholder card in `automation.html` when the
      next project is ready (look for the `<!-- ▼ NEXT AUTOMATION PROJECT -->` comment).

**Housekeeping notes:**

- `images/README.md` is a **stale placeholder doc** from an earlier version of the site
  (it lists images such as `workspace.jpg` / `portfolio1-6.jpg` that the current site no
  longer uses). Safe to remove or rewrite.
- The `parmacyShop/` folder is a cosmetic misspelling of "pharmacy" — harmless, since the
  image paths reference it consistently.

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

HTML5 · CSS3 (custom properties, Grid/Flexbox, `clamp()`) · vanilla JavaScript (ES6+,
`IntersectionObserver` + Fetch) · Fraunces + Hanken Grotesk + JetBrains Mono ·
Tailwind CDN (`wpdev.html` only).
