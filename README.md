# Siam Hossain — Portfolio

The personal site of **Siam Hossain**, a full-stack and AI engineer in Dhaka who also builds
harnesses for AI agents. It is a **static site in plain HTML, CSS and JavaScript**: no framework,
no build step, nothing to install.

🌐 **Live:** <https://alphaman-0.github.io/AboutMe/>

---

## Pages

| Page | What it shows |
|------|---------------|
| `index.html` | The hub, one section per screen: hero · client work (Nasema Pharmacy POS, stock audit, invoices) · two personal products · a statement · automation bots · full stack, AI engineering and AI harness · public repositories · about · contact |
| `pos.html` | Pharmacy POS case study: how a sale moves through the system, medicine records and receipts, what runs underneath |
| `automation.html` | AIUB Notice Bot and Email Trucker: the four steps of a run, the cron schedule, questions about failure and cost |
| `ecommerce.html` | MegaBazar storefront: four pages of the store and what it taught me (plus ShoeVista) |
| `ai-dev.html` | AI résumé builder and its ATS score, then AI harness and LLM projects (Sleep Loop, a Claude Code workflow, Gridwise) |
| `websites.html` | The two private business tools (stock audit app, invoice generator), explained without public links |
| `wpdev.html` | Scroll animation experiment: 52 frames painted to a canvas as you scroll (its own script) |

Every page shares the same fixed nav (Work menu with every case study), the same dark closing footer
and the same main action: **Email Siam**.

---

## Structure

```
AboutMe/
├── index.html                 # the hub (written by hand)
├── pos.html, automation.html, ecommerce.html, ai-dev.html, websites.html
│                              # case studies (generated, see below)
├── wpdev.html                 # scroll-animation experiment (written by hand, own canvas script)
├── scripts/build_case_pages.py# builds the five case pages from one template
├── assets/                    # the design system the pages load (see below)
├── images/                    # portraits, screenshots, GitHub captures, share-ready sizes
├── parmacyShop/               # Nasema Pharmacy POS screenshots (sized/ holds smaller copies)
├── MegaBazar/                 # MegaBazar screenshots
├── Animation/                 # 52-frame PNG sequence for wpdev.html
├── Certificates/UNESCO.pdf    # linked from About
├── Siam-Hossain-CV.pdf        # linked from the nav, hero and footer
├── favicon.svg, share.jpg     # tab icon and social preview
└── README.md
```

### Editing the case pages

The five case pages are generated. Change the copy or a section in `scripts/build_case_pages.py`,
then run:

```bash
python3 scripts/build_case_pages.py            # all five
python3 scripts/build_case_pages.py pos.html   # one page
```

Editing those `.html` files directly works too, but the next run of the script overwrites them.

---

## Design system

The pages load a small kit from `assets/`:

| File | Job |
|------|-----|
| `assets/system.css`, `assets/system.js` | tokens, grid, sections one screen tall, nav (menu panel, phone sheet), buttons, rows, footer |
| `assets/layout/layout.css`, `layout.js` | the hero layouts (split, statement) |
| `assets/ui/cards.css`, `base.css`, `ui.js`, `code/` | cards, panels and the live code excerpts |
| `assets/motion/` | hover, press and focus, and the hero's entrance on load |
| `assets/moments/` | the scroll and reveal moments: statement highlight, photo develop, pinned chapters |
| `assets/icons/` | real tool logos (Node.js, PostgreSQL, Python, Claude …) and `icon.css` |
| `assets/backgrounds/` | ground tokens |

Page-only styling sits in an inline `<style>` block in each page.

- **Palette:** cool grey ground `#eef0f3`, surface `#e2e5ea`, ink `#0b0c0e`, cobalt accent `#1f2de6`; one
  dark section, the footer.
- **Type:** Newsreader for headings, Hanken Grotesk for text (Google Fonts).
- **Layout:** every section is exactly one or two screens tall, on one 12-column grid with equal
  left and right edges, at desktop, tablet and phone widths.
- **Motion:** the hero enters once on load; links, cards and screenshots answer the pointer; each
  page has one or two scroll moments in their own section. Everything rests under reduced motion.

---

## Run locally

No build step. Serve the folder over HTTP so the modules load:

```bash
python3 -m http.server 8765
# → http://127.0.0.1:8765
```

## Deploy

Static hosting of the repo root. It is live on GitHub Pages; any static host works.

---

## Links

- GitHub — [@ALPHAMAN-0](https://github.com/ALPHAMAN-0)
- LinkedIn — [in/siamhossain4](https://www.linkedin.com/in/siamhossain4/)
- LeetCode — [RedApple47](https://leetcode.com/u/RedApple47/) · Codeforces —
  [SIAM001](https://codeforces.com/profile/SIAM001) · HackerRank —
  [BaBaYaGa_A1](https://www.hackerrank.com/profile/BaBaYaGa_A1) · Codolio —
  [babaYagaa](https://codolio.com/profile/babaYagaa)
- Email — <siam.cse.aiub@gmail.com>
