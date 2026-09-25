# Spec Sheet — Design Canvas

Static design canvas for the Stage A review. Open any `.dc.html` file directly in a browser. `Main.dc.html` is the canonical hub preview (D1); others are satellite boards.

## Layout

- `Main.dc.html` — D1 hub desktop, light, full length (the primary review board)
- `A0.dc.html` — Tokens & components
- `D2.dc.html` — Hero, dark
- `D3.dc.html` — Work states (hover / filtered / Index / skill trace)
- `D4.dc.html` — Overlays (evidence popover, pipeline selected, ⌘K)
- `D5.dc.html` — POS case study, desktop
- `D6.dc.html` — Headers for other 5 case pages (automation dark)
- `P1.dc.html` / `P2.dc.html` — Phone hero, light / dark
- `P3.dc.html` — Phone hub, full length
- `P4.dc.html` — Phone states (menu, action bar, bottom-sheet popover)
- `P5.dc.html` — POS case study, phone
- `S1.dc.html` … `S4.dc.html` — Storyboards (theme reveal, card→case morph, pipeline packet, filter reflow)

`_tokens.css` is shared by every artboard.

## Index

`canvas.json` lists every file with title + notes for the review walkthrough.

## Review notes

- Every board is rendered at its target frame (1440 wide for desktop, 390 wide for phone, varied heights for storyboards).
- The bento grid is `gap:1px` over `--rule`. Borders, not shadows, separate tiles.
- Dark mode is via `[data-theme="dark"]` on the board root.
- Fonts in artboards are system serif/sans/mono stand-ins; the live site uses Fraunces + Hanken Grotesk + IBM Plex Mono.

## After approval

Stage B rebuilds the repo files. Nothing here is checked into `main`.
