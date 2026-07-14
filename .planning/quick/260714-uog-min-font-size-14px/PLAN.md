---
type: quick-plan
slug: min-font-size-14px
quick_id: 260714-uog
created: 2026-07-14
status: in-progress
---

# Quick Task: Enforce 14px minimum font-size

## Context
Projektregel: `font-size` darf im gesamten Projekt **niemals unter 14px** liegen.
Basis-Font ist bereits auf 14px angehoben (Commit `075f4f2`), aber in
`styles/addTaskResponsive.css` sind noch drei Restwerte < 14px übrig.

## Offenders (grep result)
- `styles/addTaskResponsive.css:248` — `font-size: 13px;` (Selektor: `body.task-page .taskContainer .bottom-form`)
- `styles/addTaskResponsive.css:255` — `font-size: 12px;` (Selektor: `.bottom-form .required, .bottom-form .starFromRequired`)
- `styles/addTaskResponsive.css:274` — `font-size: 12px;` (Selektor: `.bottom-form .btn-clear, .bottom-form .btn-create`)

Alle drei liegen in der Mobile-Media-Query.

## Plan
1. Ersetze in `styles/addTaskResponsive.css` alle drei Werte auf `14px`.
2. Grep-Verifikation: keine `font-size` < 14px mehr im Repo (CSS/HTML/JS/SVG).
3. Feedback-Memory speichern: 14px als projektweite Untergrenze.
4. Atomarer Commit mit Code + Planning-Änderungen.

## Nicht in scope
- Keine Layout- oder Padding-Anpassungen. Nur Font-Sizes werden geändert.
- Kein Refactoring der Media-Query-Struktur.
