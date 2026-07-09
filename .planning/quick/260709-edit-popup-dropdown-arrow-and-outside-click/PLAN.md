---
slug: edit-popup-dropdown-arrow-and-outside-click
date: 2026-07-09
type: quick
---

# Edit-Popup Dropdown: Pfeil-Rotation + Outside-Click Close

## Problem

Auf der mobilen Edit-Task-Seite (Edit Popup → `Assigned to` Dropdown):

1. **Pfeil dreht sich nicht.** Beim Öffnen bleibt das `.down-arrow`-Chevron statisch — es gibt kein visuelles Feedback, ob das Menü offen oder zu ist.
2. **Weg-Klick schließt Menü nicht zuverlässig.** `closeAssignedto()` fügt bei jedem Klick auf `#editPopUpID` bzw. `.scrollbar` einen neuen `document.click`-Listener hinzu. Zusätzlich stoppt `#editPopUpID` die Propagation (`event.stopPropagation()`), sodass Klicks INNERHALB des Popups gar nicht am Document ankommen. Ergebnis: das Menü bleibt oft offen, wenn man auf ein anderes Feld im Popup tippt.

Der gleiche Bug betrifft auch die Add-Task-Popup-Dropdowns (`Assigned to` mit `id="Popup"` und `Category`), aber die Anfrage bezieht sich auf den Edit-Popup — die Fixes sind aber allgemein und wirken überall.

## Fix

### `js/taskUIandBackend.js`

- `toggleDropdown(id)`: 
  - Zusätzlich `show-menu` auf dem Container (`contacts-list` + id) togglen.
  - Bei „Öffnen" einen Outside-Close-Listener via **Capture-Phase** an `document` binden. Capture-Phase feuert BEVOR das bubble-phase `stopPropagation()` auf `#editPopUpID` greift → funktioniert auch für Klicks innerhalb des Popups.
  - Listener entfernt sich selbst nach Trigger.
- `toggleDropdownCategory()`: gleiche Logik für `#category-container` / `#myDropdownCategory`.
- `closeAssignedto` / `closeCategory`: als No-Op belassen (HTML-onclick-Aufrufe bleiben kompatibel, kein Listener-Stacking mehr).

### `styles/addTask.css`

Existierende Regel `.select.show-menu .down-arrow { transform: rotate(-180deg) }` auf `.selectOnEditPopUp` und `.selectPopup` erweitern, sodass Edit-Popup + Add-Task-Popup denselben Effekt bekommen. Transition-Regel analog erweitern.

## Verification

- Board → Task-Karte → Edit auf Mobile (@480px):
  - Klick auf `Assigned to` → Pfeil rotiert 180°, Liste öffnet.
  - Klick erneut auf denselben Container → Pfeil dreht zurück, Liste schließt.
  - Liste offen → Klick irgendwo anders im Popup (z.B. Description-Feld) → Liste schließt, Pfeil dreht zurück.
  - Liste offen → Klick auf Listen-Item (Checkbox) → Liste bleibt offen (Multi-Select).
- Analog Add-Task-Popup (`Assigned to` und `Category`).
