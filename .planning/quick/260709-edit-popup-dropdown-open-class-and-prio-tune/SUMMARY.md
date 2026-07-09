---
slug: edit-popup-dropdown-open-class-and-prio-tune
date: 2026-07-09
type: quick
status: complete
---

# Summary — Edit-Popup Arrow-Wrap-Bug + Prio-Buttons

## Changes

### `js/taskUIandBackend.js`
- Toggle-Klasse `show-menu` → `dropdown-open` umbenannt (in `toggleDropdown`, `toggleDropdownCategory`, `bindDropdownOutsideClose`). Löst die Kollision mit dem bare `.show-menu { display: block }`-Selektor in `addTask.css:552`, der das `display: flex` von `.selectOnEditPopUp` überschrieb → Arrow rutschte in die nächste Zeile.

### `styles/addTask.css`
- Rotations-Selektor um `.select.dropdown-open`, `.selectOnEditPopUp.dropdown-open`, `.selectPopup.dropdown-open` erweitert (alte `.select.show-menu`-Variante belassen für ggf. Legacy-Referenzen).
- `flex-shrink: 0` auf `.selectOnEditPopUp .down-arrow` und `.selectPopup .down-arrow` — der Arrow bleibt so garantiert auf derselben Zeile wie der Input.

### `styles/boardResponsive.css` @480px (Edit-Popup)
- `.buttonsPrioOnEditPopUp { gap: 4px → 6px }`.
- Neue Regel `.buttonsPrioOnEditPopUp .btn-prio { padding: 10px 6px; font-size: 14px; gap: 4px }` — Padding und Schrift kleiner für 82px-schmale Buttons im 255px-Container.
- Neue Regel `.buttonsPrioOnEditPopUp .btn-prio img { width: 16px; height: 16px }` — Icons proportional geshrinkt (statt 24px SVG default).

## Verification (visuell)

- Board → Task-Karte → Edit @480px / @375px: Assigned-To öffnen → Input + Arrow bleiben auf einer Zeile, Arrow rotiert 180° und zeigt nach oben. Klick außerhalb schließt und rotiert zurück.
- Prio-Row: 3 Buttons mit lesbarem Text „Urgent/Medium/Low" + Icon, gleiche Gesamt-Breite (255px) wie die Input-Felder.
