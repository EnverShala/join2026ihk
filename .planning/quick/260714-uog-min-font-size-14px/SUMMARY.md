---
type: quick-summary
slug: min-font-size-14px
quick_id: 260714-uog
created: 2026-07-14
completed: 2026-07-14
status: complete
---

# Summary: Enforce 14px minimum font-size

## Changes
- `styles/addTaskResponsive.css`
  - Zeile 248: `font-size: 13px` → `14px` (`.bottom-form`)
  - Zeile 255: `font-size: 12px` → `14px` (`.bottom-form .required`, `.starFromRequired`)
  - Zeile 274: `font-size: 12px` → `14px` (`.bottom-form .btn-clear`, `.btn-create`)

## Verification
Regex-Scan über `*.css`, `*.html`, `*.js`, `*.svg`:
- `font-size\s*:\s*(?:[0-9]|1[0-3])(?:\.[0-9]+)?px` → 0 Code-Treffer
- `font-size\s*:\s*0?\.\d+(?:rem|em|%)` → 0 Treffer
- `font-size\s*:\s*(?:smaller|xx-small|x-small)` → 0 Treffer

Nur historische Notizen in `.planning/quick/*/SUMMARY.md` enthalten noch alte
Werte; kein ausgelieferter Code betroffen.

## Follow-up
- Feedback-Memory `feedback_min_font_size_14px.md` gespeichert, damit die Regel
  in Folge-Sessions bekannt bleibt.
- Bei zukünftigen Mobile-Engpässen: statt Schrift zu verkleinern, `padding`,
  `gap` oder `line-height` reduzieren.
