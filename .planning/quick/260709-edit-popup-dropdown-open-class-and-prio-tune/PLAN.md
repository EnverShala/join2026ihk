---
slug: edit-popup-dropdown-open-class-and-prio-tune
date: 2026-07-09
type: quick
---

# Edit-Popup: Arrow-Wrap-Bug + Prio-Buttons Tuning

## Probleme

### 1. Assigned-To Arrow springt in nächste Zeile beim Öffnen

Beim letzten Fix habe ich beim Öffnen des Dropdowns die Klasse `.show-menu` auf `#contacts-list.selectOnEditPopUp` gesetzt, um das existierende Rotationsregelwerk aus `addTask.css` zu triggern. Problem: In `addTask.css:552` existiert ein **bare `.show-menu` Selektor** mit `display: block`. Das überschreibt das `display: flex` von `.selectOnEditPopUp` (gleiche Spezifität 0-1-0, aber später in der Kaskade) — Input und Arrow werden dadurch zu Block-Elementen und der Arrow rutscht in die nächste Zeile.

Der User will: Arrow soll auf der gleichen Zeile bleiben und nur gespiegelt (rotate) werden.

### 2. Prio-Buttons wirken auf @480px zu gedrängt / off-design

Die 3 Prio-Buttons erben `padding: 16px 10px; font-size: 16px; gap: 8px` aus den Basis-/@576px-Regeln. Bei 255px Container-Breite und 3 Buttons + 2 Gaps hat jeder Button nur ~82px, wobei die Icons (24×24 SVG) fast so breit wie der Text sind. Optisch wirkt das gedrückt.

## Fix

### `js/taskUIandBackend.js`
- Toggle-Klasse von `show-menu` → `dropdown-open` umbenennen (ersetzt in `toggleDropdown`, `toggleDropdownCategory`, `bindDropdownOutsideClose`). Damit kein Konflikt mit dem globalen `.show-menu { display: block }`.

### `styles/addTask.css`
- Neuen Selektor `.select.dropdown-open .down-arrow, .selectOnEditPopUp.dropdown-open .down-arrow, .selectPopup.dropdown-open .down-arrow { transform: rotate(-180deg) }` hinzufügen (alte `.show-menu`-Regel bleibt für ggf. andere Nutzung — aktueller Code triggert sie nicht mehr).
- Zusätzlich `flex-shrink: 0` auf `.selectOnEditPopUp .down-arrow` und `.selectPopup .down-arrow` als Defense-in-Depth: garantiert, dass der Arrow nie schrumpft/wrappt.

### `styles/boardResponsive.css` @480px (Edit-Popup Prio)
- `.buttonsPrioOnEditPopUp { gap: 4px → 6px }`.
- Neue Regel `.buttonsPrioOnEditPopUp .btn-prio { padding: 10px 6px; font-size: 14px; gap: 4px }` — kleinere Innen-Padding + kleinere Schrift, damit „Urgent/Medium/Low" jeweils klar lesbar in ~82px sitzt.
- `.buttonsPrioOnEditPopUp .btn-prio img { width: 16px; height: 16px }` — Icons proportional verkleinert.

## Verification

- Board → Task-Karte → Edit @480px / @375px:
  - Assigned-To öffnen → Trigger-Zeile bleibt intakt (Input + Arrow auf einer Zeile), Arrow rotiert 180° (zeigt nach oben).
  - Dropdown-Liste erscheint sauber unter dem Trigger, gleiche Breite.
  - Prio-Buttons: 3 Buttons + Icons in einer Zeile lesbar, gleiche Breite wie Inputs.
