---
slug: contacts-header-clip-and-edit-popup-align
date: 2026-07-09
type: quick
---

# Contacts-Header Clip fix + Edit-Popup Mobile-Alignment mit Add-Popup

## Probleme

### 1. „Contacts | Better with a team" wird auf Mobile oben abgeschnitten

Screenshot zeigt die Top-Halbwelle von „Contacts" verdeckt. Ursache:
- `@media (max-width: 425px) and (max-height: 730px)` in `contactsResponsive.css:543-547` setzt `.display-contact-header { margin-top: -30px }`. Ursprünglich für die alte absolut-positionierte Header-Version gedacht, jetzt aber schädlich, weil `.display-contact-header` neu als in-flow Block mit `order: -1` positioniert ist — der negative Margin schiebt ihn über die Container-Oberkante, wo er von `overflow: auto` gecappt wird.
- Ältere Breakpoints (`@696`, `@570`, `@535`, `@420`) setzen zusätzlich `width: 550/450px`, `top: 180px`, `left: 20/40/80px` etc. Auf Mobile mit `position: static` sind top/left irrelevant, aber die feste Pixelbreite überläuft den Viewport.

### 2. Edit-Task-Popup Mobile ist nicht bündig mit Add-Task-Popup Mobile

Der User sagt: Add Task Popup Mobile „funktioniert top", Edit hat mehrere Design-Probleme. Aktuelle Diskrepanzen bei den Widths:

| Breakpoint | Add Popup | Edit Popup (vorher) |
|---|---|---|
| @480 popup | 300px | 320px |
| @480 inputs | 240px | 255px |
| @560 popup | 400px (falsch) | 400px |
| @560 inputs | 280px | 300px |

Zusätzlich sind Edit-Labels 18–20px, Add-Labels erben Body-Default (~16px). Und `.scrollbar` in Edit hat kein `gap` zwischen Sektionen, Add hat `gap: 30px` — sichtbar unterschiedlicher vertikaler Rhythmus.

## Fix

### `styles/contactsResponsive.css`

- Aus `@425 + @730`-Block das `.display-contact-header` entfernen (nur `.display-contact` behält `margin-top: -70px`).
- Neuer Block AM ENDE der Datei mit `@media (max-width: 800px)` + `.display-contact-header { position: static; top/left: unset; width: 100%; max-width: 100%; margin: 0; padding: 16px 8px 12px }`. Steht am Ende → gewinnt bei gleicher Spezifität gegen die legacy Regeln in `@696/@570/@535/@420`.

### `styles/boardResponsive.css`

**@480 (Edit-Popup):**
- `.popupOnTaskEdit { width: 320px → 300px }` (matcht Add's `#myModal { width: 300px }`).
- `.editPopupTitelMainContainer, ... { width: 280px → 260px }` (proportional zum popup).
- `.editTitelInput, .selectOnEditPopUp, .editDropdown, .editPrio, .buttonsPrioOnEditPopUp { width: 255px → 240px }` (matcht Add's `.inputPopup { width: 240px }`).
- `.buttonsPrioOnEditPopUp .btn-prio { padding: 10px 6px → 10px 4px; font-size: 14px → 13px; icon 16 → 14 }` — noch schmalere Buttons für 240px-Container.
- Labels (`.editPopupTitelTxt` etc.): `18px → 16px` (matcht Add-Label-Default).

**@560:**
- `.popupOnTaskEdit { width: 400px → 380px }` (matcht Add's `#myModal { width: 380px }` @560).
- `.editTitelInput, .selectOnEditPopUp, .editDropdown, .editPrio { width: 300px → 280px }` (matcht Add's `.inputPopup { width: 280px }`).
- Labels: `20px → 16px`.
- Neu: `.popupOnTaskEdit .scrollbar { gap: 12px }` — vertikaler Rhythmus zwischen Sektionen (analog zu Add's `.mainContainerPopUp { gap: 30px }`, gedämpft für Mobile).

## Verification

- Contacts @375×667 (Mobile mit Höhe < 730px): „Contacts | Better with a team" sitzt komplett sichtbar oberhalb der Liste, kein Clipping am oberen Rand.
- Contacts @420px oder schmaler: Header nimmt volle Container-Breite, nicht mehr 550px overflow.
- Board → Task-Karte → Edit @375px:
  - Popup 300px breit (wie Add-Task-Popup).
  - Inputs 240px, Labels 16px, Sektionen einheitlich vertikal gestapelt.
  - Prio-Buttons 3× ~80px, Text „Urgent/Medium/Low" lesbar.
- Board → Task-Karte → Edit @480–560px: Popup 380px, Inputs 280px, Labels 16px — deckungsgleich mit Add-Task-Popup an denselben Breakpoints.
