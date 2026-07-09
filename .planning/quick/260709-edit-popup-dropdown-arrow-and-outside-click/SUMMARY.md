---
slug: edit-popup-dropdown-arrow-and-outside-click
date: 2026-07-09
type: quick
status: complete
---

# Summary — Edit-Popup Dropdown: Pfeil-Rotation + Outside-Click Close

## Changes

### `js/taskUIandBackend.js`

- Neue Helper-Funktion `bindDropdownOutsideClose(dropdown, container)`: bindet einen One-Shot Capture-Phase `click`-Listener an `document`. Capture-Phase feuert bevor `event.stopPropagation()` auf `#editPopUpID` greift, sodass auch Klicks innerhalb des Popups (aber außerhalb des Dropdowns) das Menü sauber schließen. Listener entfernt sich selbst nach Trigger. `setTimeout(…, 0)` verhindert Self-Close durch den Öffnungs-Klick.
- `toggleDropdown(id)`: setzt zusätzlich `.show-menu` auf `#contacts-list{id}` (Trigger für Pfeil-Rotation) und ruft `bindDropdownOutsideClose` beim Öffnen auf.
- `toggleDropdownCategory()`: analog für `#category-container` / `#myDropdownCategory`.
- `closeAssignedto(id)` und `closeCategory()`: zu No-Ops reduziert (HTML-Inline-onclicks bleiben kompatibel). Vorher fügte jeder Klick auf `#editPopUpID` bzw. `.scrollbar` einen neuen Document-Listener hinzu — nicht mehr.

### `styles/addTask.css`

- Transition-Regel für `.selectOnEditPopUp .down-arrow` und `.selectPopup .down-arrow` ergänzt (die bestehende `.select .down-arrow`-Regel mit `height/width/flex` bleibt unverändert, um Add-Task-Seite nicht optisch zu verändern).
- Existierender `.select.show-menu .down-arrow { transform: rotate(-180deg) }`-Selektor um `.selectOnEditPopUp.show-menu` und `.selectPopup.show-menu` erweitert. Damit greift die Rotation jetzt für:
  - Edit-Popup „Assigned to" (`#contacts-list.selectOnEditPopUp`)
  - Add-Task-Popup „Assigned to" (`#contacts-listPopup.selectOnEditPopUp`)
  - Add-Task-Popup „Category" (`#category-container.selectPopup`)
  - Add-Task-Seite „Assigned to" + „Category" (`.select`, bereits vorher gedeckt)

## Verification (visuell)

- Board → Task-Karte → Edit auf Mobile (@480px / @375px):
  - Klick auf „Assigned to" → Pfeil rotiert -180°, Liste öffnet.
  - Zweiter Klick auf denselben Container → Pfeil dreht zurück, Liste schließt.
  - Liste offen → Klick auf Description-Feld → Liste schließt (via Capture-Phase Listener, trotz `stopPropagation` auf `#editPopUpID`).
  - Liste offen → Klick auf Listen-Item (Checkbox) → Liste bleibt offen (Klick ist Descendant von `#myDropdown`).
- Analog Add-Task-Popup und Add-Task-Seite.
