# Siam Hossain — Portfolio

A fast, recruiter-friendly personal portfolio for **Siam Hossain** — a Computer Science
student and full-stack / AI developer. It's a **static site built with plain HTML, CSS, and
JavaScript** — no framework, no build step, no dependencies.

> **Design goal:** a recruiter or hiring manager should grasp *who I am, what I do, and my
> level* within ~5 seconds, and the site should be comfortable to read on any device.

---

## ✨ Highlights

- **Light, professional "editorial dossier" theme** — warm off-white paper, near-black ink, a
  single confident cobalt accent. Calm and scannable rather than flashy.
- **The 5-second scan** — the hero is a résumé-header *summary card*: role, one-line summary,
  current status, top skills, and a **Download CV** button, all above the fold on desktop and
  mobile. Nothing critical is hidden behind scroll animations.
- **Scannable content** — About, an Experience & education timeline, a categorized skills
  grid, project cards, and a live problem-solving section.
- **Live competitive-programming stats** — LeetCode and Codeforces solved counts are fetched
  live in the browser (HackerRank via a CORS proxy with a hardcoded fallback; see notes).
- **Mobile-first & accessible** — responsive layout, WCAG-AA contrast, visible `:focus`
  outlines, and `prefers-reduced-motion` support.
- **Four standalone case-study pages** for selected projects, all sharing the light theme and
  a unified top bar.

---

## 🗂 Project structure

```
AboutMe/
├── index.html          # Main single-page portfolio (About · Experience · Skills · Work · Solving · Contact)
├── ai-dev.html         # Case study — AI + Development (AI résumé builder, LLM agents, automation)
├── pos.html            # Case study — Pharmacy POS (interactive screenshot gallery)
├── ecommerce.html      # Case study — E-Commerce / MegaBazar (interactive screenshot gallery)
├── wpdev.html          # Case study — Scroll Animation (scroll-linked HTML5 canvas, 52 frames)
├── css/
│   └── style.css       # Single stylesheet — design tokens + all shared components
├── js/
│   └── script.js       # Active-nav highlight + live competitive-programming stats
├── images/
│   ├── SIAM.jpeg               # Portrait (About section)
│   ├── ai-resume-builder-preview.png
│   └── pos/                    # POS screenshots (admin / manager / cashier)
├── MegaBazar/          # E-commerce case-study screenshots
├── parmacyShop/        # Pharmacy POS case-study screenshots
├── Animation/          # 52-frame PNG sequence for the scroll-animation page
├── .claude/
│   ├── server.mjs      # Tiny Node static file server (port 8765, path-traversal guarded)
│   └── launch.json     # Debug/launch config for the static server
└── README.md
```

Note: `ai-dev.html`, `pos.html`, and `ecommerce.html` link the shared `css/style.css` (plus
a small inline `<style>` for page-specific layout). `wpdev.html` is fully self-contained
(its own inline styles + script, and Tailwind CDN for layout utilities).

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

**Typography** (Google Fonts):
- **Fraunces** — display serif, used for the name and section headings.
- **Hanken Grotesk** — body & UI sans; carries all scan-critical text (fastest to read).
- **JetBrains Mono** — small uppercase labels, metadata, and numbers (the "engineer" signal).

---

## 🧠 JavaScript (`js/script.js`)

Intentionally minimal — no custom-cursor / parallax / scramble effects:

- **Active-nav highlight** — an `IntersectionObserver` marks the current section in the top bar.
- **Live problem-solving stats:**
  - **LeetCode** — via the public `alfa-leetcode-api` proxy.
  - **Codeforces** — via the official, CORS-enabled Codeforces API (counts unique solved).
  - **HackerRank** — no public CORS API, so it's routed through `corsproxy.io`; the card also
    has a **hardcoded fallback value** so it always renders even if the proxy is unavailable.
  - **Codolio** — shown as the aggregate "total" (hardcoded; no public API).

The scroll-animation page (`wpdev.html`) has its own self-contained script that paints a
52-frame sequence to a `<canvas>` driven by scroll position (rendered synchronously so it
works even where `requestAnimationFrame` is throttled).

---

## 🚀 Run locally

No build step. Either open `index.html` directly, or (recommended, so the live-stats fetches
and asset paths behave correctly) serve it over HTTP:

```bash
node .claude/server.mjs
# → http://127.0.0.1:8765
```

Any static server works too, e.g. `python3 -m http.server 8765`.

## 🌐 Deploy

It's a static site — host the repo root on **GitHub Pages** (or Netlify/Vercel/any static
host). No configuration required.

---

## ✅ To personalize

A few items are intentionally left as placeholders:

- [ ] **Add your résumé** as `Siam-Hossain-CV.pdf` at the repo root — every **Download CV**
      button links to it.
- [ ] **Confirm the Experience dates & bullets** in `index.html` (marked with `TODO` comments).
- [ ] *(Optional)* Replace the `Animation/` frame sequence on `wpdev.html` with your own work.

---

## 🔗 Links

- GitHub — [@ALPHAMAN-0](https://github.com/ALPHAMAN-0)
- LinkedIn — [in/siamhossain4](https://www.linkedin.com/in/siamhossain4/)
- LeetCode — [RedApple47](https://leetcode.com/u/RedApple47/) · Codeforces —
  [SIAM001](https://codeforces.com/profile/SIAM001) · HackerRank —
  [BaBaYaGa_A1](https://www.hackerrank.com/profile/BaBaYaGa_A1)

## 🛠 Tech

HTML5 · CSS3 (custom properties, Grid/Flexbox) · vanilla JavaScript (ES6+) ·
Fraunces + Hanken Grotesk + JetBrains Mono · Tailwind CDN (`wpdev.html` only).
