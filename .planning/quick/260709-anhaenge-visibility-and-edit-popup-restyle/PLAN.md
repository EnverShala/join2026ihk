---
slug: anhaenge-visibility-and-edit-popup-restyle
date: 2026-07-09
type: quick
---

# Anhänge sichtbar + Edit-Popup visuell wie Add Task

## Problem 1 — Anhänge wird vom Sticky-Bar überdeckt

`body.task-page .taskContainer .bottom-form` ist auf ≤800px `position: sticky; bottom: 96px`. Damit sitzt der Sticky-Bar dauerhaft 96px über dem Container-Ende und überdeckt Content im Bereich `[containerBottom-96px-stickyHeight … containerBottom-96px]`. Anhänge, das letzte Element im `<form>`, fällt genau in diese Zone.

**Fix:** dem `<form>` auf Mobile ein `padding-bottom` geben, das größer ist als die Sticky-Zone (~120px), damit Anhänge nach oben scrollbar ist.

## Problem 2 — Edit-Popup soll wie Add Task aussehen

Der Edit-Popup (`#editPopUpID`, `.popupOnTaskEdit`) nutzt eigene Klassen (`.editTitelInput`, `.inputOnEditPopup`, `.selectOnEditPopUp`, `.okButtonOnEditPopUp`) mit abweichender Optik: `border: 1px solid #d1d1d1`, `height: 48px`, `padding: 0 10px`, teils ohne `font-size` (Browser-Default). Das sieht nicht wie die Add Task-Page aus.

**Fix (nur CSS, Funktionalität unangetastet):** Style-Regeln in `boardInput.css` und `boardResponsive.css` an die Add-Task-Optik angleichen:

- Inputs: `border: 1px solid #dfdede`, `padding: 12px 21px`, `font-size: 20px`, `font-family: inherit`, `border-radius: 10px`, `height: auto`, `box-sizing: border-box`.
- `.selectOnEditPopUp`: analog.
- OK-Button: `.btn-create`-Style (border #2a3647, radius 10, padding 16, font 20 700, bg #2a3647, white text, Hover mit shadow).

## Scope

- `styles/addTaskResponsive.css`: `padding-bottom` an `<form>` im ≤800px-Block.
- `styles/boardInput.css`: Restyle Edit-Popup-Inputs + OK-Button.
- `styles/boardResponsive.css`: 480px-Block Edit-Popup an neuen Look angleichen (border/padding/font).

## Out of scope

- HTML/JS unverändert (keine geänderten IDs/Handler).
- Buttons-Anzahl bleibt (Edit hat nur OK, kein Clear).

## Verification

- Add Task Mobile: bis nach unten scrollen → Anhänge komplett sichtbar über Sticky-Bar.
- Board → Task-Karte → Edit: Inputs, Labels, OK-Button optisch wie Add Task (Border-Farbe, Padding, Font, Radius). Funktionen (Editieren, Speichern) unverändert.
