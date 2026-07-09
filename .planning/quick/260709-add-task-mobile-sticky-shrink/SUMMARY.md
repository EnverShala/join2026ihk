---
slug: add-task-mobile-sticky-shrink
date: 2026-07-09
type: quick
status: complete
---

# Summary — Add Task mobile: shrink sticky bottom note + buttons

## Change
`styles/addTaskResponsive.css` — sticky `.bottom-form` (≤800px) auf Mobile deutlich verkleinert:

- `.bottom-form` padding 12→8 vertikal, `font-size: 12px`, `align-items: center`.
- `.required-note` / `.required` / `.starFromRequired` → `font-size: 12px`, `line-height: 1.2`, keine überschüssigen Margins.
- `.actions-form` gap 16→8px.
- `.btn-clear` / `.btn-create` padding 16→6px 10px, `font-size: 20→13px`, gap 6→4, radius 10→8.
- Button-Icons auf 14×14px.
- 576px- und 376px-Blöcke: `.bottom-form { font-size: 12px }`, Button-Overrides gezielt via `body.task-page .taskContainer .bottom-form ...` damit die kleineren Werte nicht wieder wachsen; `.bottom-form` aus dem input `font-size: 14px` Selector entfernt.

## Verification
- Visuelle Prüfung in Chrome DevTools bei 800px / 576px / 375px empfohlen: Note + Buttons wirken deutlich kompakter, alles bleibt einreihig.

## Follow-ups
- Keine.
