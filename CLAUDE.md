# AboutMe — CLAUDE.md

## Build / test / lint
- None found — no `package.json`/`go.mod`/`pyproject.toml`/`Cargo.toml` at repo root; static HTML/CSS/JS, no build step. (dir scan)
- Local dev server: `node .claude/server.mjs` → `http://127.0.0.1:8765` (README.md)

## Rules observed
- No framework, no build step, no external dependencies to install. (README.md)
- Page-specific visual work goes in an inline `<style>` block on that page, not into the shared `css/style.css` — index.html's own header comment states its enhancement styles are "PAGE-SCOPED ... index.html only" and that `css/style.css` is "intentionally left untouched." (index.html)
- Case-study pages are flat files at repo root named after the project (e.g. `pos.html`), not nested in subfolders. (dir scan)

## Read first
- README.md — project structure, page inventory, design tokens, asset wiring
- index.html — the hub page and its section/nav id conventions
- css/style.css — shared design tokens and components (not yet read this pass — read before touching shared styles)

Architecture: see ARCHITECTURE.md — read before structural changes
