---
slug: anhaenge-visibility-and-edit-popup-restyle
date: 2026-07-09
type: quick
status: complete
---

# Summary — Anhänge sichtbar + Edit-Popup visuell wie Add Task

## Changes

### `styles/addTaskResponsive.css`
- `body.task-page .taskContainer form { padding-bottom: 120px }` im `@media (max-width: 800px)`-Block: schafft Scrollraum unterhalb Anhänge, sodass das letzte Feld über die 96px+Sticky-Bar-Zone hinausscrollt und komplett sichtbar wird.

### `styles/boardInput.css` (Edit-Popup Restyle)
- `.editInputGroup, .editTitelInput, .editDescriptionInput, .editDateInput, .editAssignedInput, .editSubtaskInput`: Border `#d1d1d1 → #dfdede`, Padding `0 10px → 12px 21px`, `font-size: 20px`, `font-family: inherit`, `width: 100%; max-width: 440px; box-sizing: border-box; height: auto`.
- `.inputOnEditPopup`: Padding `10px → 12px 21px`, `box-sizing: border-box`.
- `.selectOnEditPopUp`: gleiche Regeln (border/padding/font/box-sizing/height auto), `max-width: 440px`.
- `.okButtonOnEditPopUp`: Style an `.btn-create` angeglichen (padding `16px 24px`, `font-size: 20px`, `line-height: 1.2`, `gap: 6px`, `cursor: pointer`) + Hover mit `box-shadow` und Cyan-Hintergrund.

### `styles/boardResponsive.css` (mobile parity)
- `@media (max-width: 576px)`: Edit-Inputs behalten neue Optik: Border `#dfdede`, Padding `10px 16px`, `font-size: 16px`, `height: auto`.
- `@media (max-width: 480px)`: gleiche Regeln mit `padding: 10px 14px; font-size: 15px` — bleibt schmal aber konsistent.

## Rationale (sticky Anhänge fix)

`.bottom-form` ist sticky mit `bottom: 96px` innerhalb der Scroll-Container `.taskContainer`. Damit belegt der Sticky-Bar dauerhaft die Zone `containerBottom - 96px - stickyHeight` bis `containerBottom - 96px`. Anhänge saß unmittelbar darüber. Mit `padding-bottom: 120px` auf `<form>` gibt es genug Scroll-Reserve nach Anhänge, sodass beim Scrollen an das Formular-Ende Anhänge deutlich oberhalb der Sticky-Zone landet.

## Funktionalität

Alle IDs / onclick-Handler / DOM-Struktur unverändert. Nur CSS-Werte geändert.

## Verification (visuell)

- Add Task Mobile (≤800px): bis nach unten scrollen → Anhänge steht komplett frei über dem Sticky-Bar.
- Board → Task-Karte → Edit (Desktop): Inputs mit heller Border, Padding und Font wie Add Task; OK-Button dunkelblau mit Hover-Cyan.
- Board → Task-Karte → Edit (Mobile ≤576/480px): Inputs schrumpfen kontrolliert (300/255px), aber Farb-/Padding-/Font-Sprache bleibt identisch zu Add Task.
