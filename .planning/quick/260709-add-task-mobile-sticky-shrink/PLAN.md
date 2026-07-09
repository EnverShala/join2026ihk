---
slug: add-task-mobile-sticky-shrink
date: 2026-07-09
type: quick
---

# Add Task mobile: shrink sticky bottom note + buttons

Auf task.html im mobilen Layout (≤800px) sitzt die `.bottom-form` sticky am unteren Rand. Aktuell übernimmt sie die Desktop-Größen (Note `font-size: 20px`, Buttons `padding: 16px`, `font-size: 20px`), was auf schmalen Displays viel zu wuchtig wirkt.

## Goal
- Der `*This field is required` Legend-Text (`.required-note` / `.required`) im Sticky-Bereich wird deutlich kleiner.
- Die Buttons `Clear` und `Create Task` (`.btn-clear`, `.btn-create`) werden im Sticky-Bereich deutlich kleiner (Padding, Font, Icon).

## Scope (nur `styles/addTaskResponsive.css`)
1. Im `@media (max-width: 800px)` Block innerhalb `body.task-page .taskContainer .bottom-form`:
   - `.required-note` / `.required` font-size ~12px, line-height reduziert.
   - `.btn-clear`, `.btn-create`: padding ~8px 12px, font-size ~13px, border-radius bleibt, gap kleiner.
   - Icons in Buttons (`img`) verkleinern (~14px).
   - `.actions-form { gap: 8px }`.
2. Bestehende 576px- und 376px-Overrides beibehalten oder mit den neuen mobilen Werten harmonisieren (kein Wachstum bei kleineren Breakpoints).

## Out of scope
- Desktop-Layout (>800px).
- Andere Formularinputs oder Header.
- HTML/JS.

## Verification
- Chrome DevTools 800px, 576px, 375px: Note und Buttons sind sichtbar kleiner, Layout bleibt einreihig, nichts wird abgeschnitten.
