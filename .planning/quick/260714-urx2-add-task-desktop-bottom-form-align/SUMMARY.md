---
type: quick-summary
slug: add-task-desktop-bottom-form-align
quick_id: 260714-urx2
created: 2026-07-14
completed: 2026-07-14
status: complete
---

# Summary: form max-width verhindert bottom-form-Drift bei 2400px

## Änderung
- `styles/addTask.css` — Base-Regel für `form` bekommt `max-width: 1080px`.

## Warum das reicht
- `.bottom-form` hat `flex-basis: 100%; width: 100%; max-width: 976px`. Ohne
  form-Deckelung ist die 100%-Referenz die volle Form-Breite (Viewport −
  Sidebar) — bei 2400px sind das ~2100px, was Flexbox in bestimmten Browsern
  bei Wrap-Zeilen inkonsistent handhabt und die `.bottom-form` gegen die
  Spalten oben verschiebt.
- Mit `form { max-width: 1080px }` ist die Referenz für die 100%-Berechnung
  konstant 1080px, unabhängig vom Viewport. Die Layout-Rechnung wird
  deterministisch: `.bottom-form` sitzt immer identisch positioniert (links,
  976px breit), egal ob 1600px oder 2400px.
- Die 1080px liegen knapp über der natürlichen Content-Row-Breite der
  Spalten (~1065px inkl. `content-box`-Padding+Border der 440px-Inputs),
  damit die Spalten nicht durch die neue Deckelung umbrechen.

## Nicht angerührt (bewusst)
- `.bottom-form { max-width: 976px }` bleibt. Ein zusätzliches Bumpen auf
  1065–1080px würde die Buttons zur Spalten-Rechten hin ziehen, hat aber
  Regressionsrisiko in den Responsive-Breakpoints und ist ein separates
  Alignment-Refinement.
- `@media (max-width: 1390px)` und darunter überschreiben `form { width: 500px }`
  bzw. spätere Regeln — dort greift die neue Deckelung nicht, kein Konflikt.

## Manuelle Prüfung
Auf `task.html` bei Viewport 1600px, 2000px und 2400px vergleichen: `.bottom-form`
(Buttons + `* Required`) darf gegenüber den Spalten darüber nicht mehr
"verrutschen".
