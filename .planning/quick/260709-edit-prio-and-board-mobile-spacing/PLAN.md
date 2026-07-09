---
slug: edit-prio-and-board-mobile-spacing
date: 2026-07-09
type: quick
---

# Edit-Popup Prio/Dropdown Width + Board Mobile Weißraum

## Probleme

### 1. Assigned-To Dropdown „zu breit und komisch" (Mobile Edit Task)

Bei @480px:
- Container `.editPopupAssignedToMainContainer` = 280px
- Trigger `.selectOnEditPopUp` = 255px
- `#myDropdown.dropdown-content { width: 100% }` → 100% von `.editDropdown` (kein eigenes Width-Rule, damit 280px)
- **Ergebnis:** Trigger 255px, geöffnete Dropdown-Liste 280px → 25px breiter als Trigger, überkragt Input-Alignment.

Gleiches Bild bei @560px:
- Container 320px, Trigger 300px, Dropdown 320px.

Zusätzlich: `.editPrio` und `.buttonsPrioOnEditPopUp` sind auf beiden Breakpoints jeweils 25/20px breiter als die Input-Felder (280 vs 255 @480, 320 vs 300 @560). User: „die 3 priority buttons insgesamt nicht mehr width als die input felder".

### 2. Board Mobile: zu viel Weißraum oben und unten

- `.boardHeader { height: 180px }` (Base-Rule aus `board.css`) — bleibt auch auf Mobile 180px hoch. Zu viel Luft zwischen Header-Titel „Board" und erster Task-Reihe.
- `.statuses { margin-top: 50px; margin-bottom: 200px }` (aus `@media (max-width: 1180px)` in `boardResponsive.css`) wird von Mobile geerbt. 200px Bottom-Margin plus fixierte 96px Mobile-Nav-Bar = massiver Leerraum unter der letzten Task-Karte.

## Fix

### `styles/boardResponsive.css`

**@480px:**
- `.editPrio { width: 280px → 255px }` (matcht Input-Breite).
- `.buttonsPrioOnEditPopUp` (späteres Occurrence): `width: 280px → 255px` (frühere 260px-Regel wird durch spätere ohnehin überschrieben; nur die spätere anpassen).
- Neuer Selektor `.editDropdown { width: 255px }` — damit `#myDropdown.dropdown-content` (100% des Parents) auf 255px kollabiert und mit dem Trigger fluchtet.

**@560px** (Edit-Popup Mobile-Standard-Block):
- `.editPrio { width: 320px → 300px }` (matcht Input-Breite).
- Neuer Selektor `.editDropdown { width: 300px }` — Dropdown-Alignment mit Trigger.

**@800px** (bereits existierender `.boardSection`-Block):
- `.boardHeader { height: auto }` — reset der 180px-Fix-Höhe.
- `.statuses { margin-top: 16px; margin-bottom: 112px }` — override der @1180px-Regel. 112px = ~96px Bottom-Nav + 16px Puffer, damit letzte Karte nicht unter Nav-Bar verschwindet, aber ohne den bisherigen 200px-Overhead.

## Verification

- Board → Task-Karte → Edit @480px / @375px:
  - Prio-Container sitzt bündig mit Description-Input (255px).
  - Assigned-To öffnen → Dropdown-Liste hat identische Breite wie Trigger.
- Board → Task-Karte → Edit @560px:
  - Prio 300px, Dropdown 300px, Inputs 300px — alle fluchten.
- Board-Seite @480px / @375px:
  - Sichtbar weniger Luft zwischen „Board"-Titel und erster To-Do-Karte.
  - Sichtbar weniger Luft unter letzter Done-Karte, letzte Karte bleibt oberhalb der Bottom-Nav sichtbar.
