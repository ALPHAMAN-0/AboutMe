# AboutMe — CLAUDE.md

## Build / test / lint
- No build step: static HTML/CSS/JS. Serve locally with `python3 -m http.server 8765` → `http://127.0.0.1:8765` (README.md)
- Case pages (`pos.html`, `automation.html`, `ecommerce.html`, `ai-dev.html`, `websites.html`) are generated: `python3 scripts/build_case_pages.py [page.html]` (scripts/build_case_pages.py)

## Rules observed
- No framework, no build step, no dependencies to install. (README.md)
- Never edit the kit files in `assets/` (system.css, system.js, ui/, motion/, layout/, moments/, icons/icon.css); page-only styling goes in the page's inline `<style>`. (index.html, scripts/build_case_pages.py)
- Edit the five case pages in `scripts/build_case_pages.py`, not in their `.html`: the script overwrites them. `index.html` and `wpdev.html` are hand-written. (scripts/build_case_pages.py)
- Every section is one or two screens tall; the main action is "Email Siam" (mailto) everywhere. (index.html)
- Facts on the site come from the CV and the real repos; `images/pos/` is a different demo POS (Shopkeep), not Nasema: do not use it for the Nasema case. (Siam-Hossain-CV.pdf, images/pos/)

## Read first
- README.md — pages, structure, design system
- index.html — the hub, its section ids and page CSS
- scripts/build_case_pages.py — the shared nav, footer and case-page bodies

Architecture: see ARCHITECTURE.md — read before structural changes
