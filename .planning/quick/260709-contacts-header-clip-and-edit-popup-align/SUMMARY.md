---
slug: contacts-header-clip-and-edit-popup-align
date: 2026-07-09
type: quick
status: complete
---

# Summary — Contacts-Header Clip fix + Edit-Popup Mobile-Alignment mit Add-Popup

## Changes

### `styles/contactsResponsive.css`

- `@media (max-width: 425px) and (max-height: 730px)`: `.display-contact-header` aus der `margin-top: -30px` Regel entfernt. Der Legacy-Nudge war für die alte absolut-positionierte Version gedacht und schob den neuen in-flow Header über die Container-Oberkante, wo er von `overflow: auto` gecappt wurde.
- Neuer Block am Ende der Datei (`@media (max-width: 800px)`) mit definitivem Reset für `.display-contact-header`: `position: static; top/left: unset; width/max-width: 100%; margin: 0; padding: 16px 8px 12px`. Steht nach allen älteren Breakpoints (`@696/@570/@535/@420`), gewinnt daher bei gleicher Spezifität und normalisiert die legacy `width: 550/450px`-Overrides.

### `styles/boardResponsive.css` — Edit-Popup mit Add-Popup abgleichen

**@480:**
- `.popupOnTaskEdit { width: 320px → 300px }` (matcht Add's `#myModal { width: 300px }`).
- `.editPopupTitelMainContainer, ... { width: 280px → 260px }`.
- Inputs / `.selectOnEditPopUp` / `.editDropdown` / `.editPrio` / `.buttonsPrioOnEditPopUp`: `width: 255px → 240px` (matcht Add's `.inputPopup { width: 240px }`).
- `.buttonsPrioOnEditPopUp .btn-prio { padding: 10px 4px; font-size: 13px }`, Icons `16px → 14px` (schmalere Buttons für 240px-Container).
- Edit-Labels: `18px → 16px` (matcht Add-Label-Default).

**@560:**
- `.popupOnTaskEdit { width: 400px → 380px }` (matcht Add's `#myModal { width: 380px }`).
- Inputs / `.selectOnEditPopUp` / `.editDropdown` / `.editPrio`: `width: 300px → 280px`.
- Edit-Labels: `20px → 16px`.
- Neu: `.popupOnTaskEdit .scrollbar { gap: 12px }` — vertikaler Rhythmus zwischen Sektionen (Analog zu Add's `.mainContainerPopUp { gap: 30px }`, für Mobile gedämpft).

## Verification (visuell)

- Contacts @375px auf kurzem Bildschirm (≤730px): „Contacts | Better with a team" komplett sichtbar oberhalb der Liste, kein Top-Clipping mehr.
- Contacts @420px und schmaler: Header nimmt volle Container-Breite, keine 550px-Overflow-Cuts.
- Board → Task → Edit @375px: Popup 300px, Inputs 240px, Labels 16px, Prio-Buttons kompakt aber lesbar — Layout wie Add-Task-Popup.
- Board → Task → Edit @480–560px: Popup 380px, Inputs 280px, Labels 16px, konsistente 12px Section-Gaps.
