---
type: quick-summary
slug: board-popup-add-no-reload
quick_id: 260714-urx
created: 2026-07-14
completed: 2026-07-14
status: complete
---

# Summary: Kein Board-Reload nach Add-Task-Popup

## Änderungen
- `js/taskUIandBackend.js`
  - `createTask(id)` reicht `id` an `showSuccessMessage(id)` durch.
  - `showSuccessMessage(id = "")`:
    - Toast wie bisher 3s einblenden.
    - `id === "Popup"` → Dialog `#myModal` schließen, `closeModal()` (Popup-State-Reset)
      und `renderTaskCards()` — keine Navigation.
    - `id === ""` (Standalone `task.html`) → wie zuvor `window.location.href = "board.html"`.

## Warum das ohne Reload klappt
- `renderTaskCards()` (in `js/boardDialogs.js:253`) macht `await loadTasks("/tasks")` +
  DOM-Update der vier Column-Container. Genau derselbe Pfad wie beim initialen
  Board-Load (`<body onload="renderTaskCards(); …">`) und beim Edit
  (`editCurrentTask()` in `boardDialogs.js:60`, das schon `await renderTaskCards()` verwendet).
- Ladereihenfolge in `board.html`: `boardDialogs.js` → `taskUIandBackend.js` — beide
  Symbole (`renderTaskCards`, `closeModal`) stehen zur Verfügung. Defensive
  `typeof … === "function"`-Checks vermeiden ReferenceErrors auf `task.html`,
  wo `renderTaskCards` nicht existiert.

## Verifikation (statisch)
- `showSuccessMessage` wird nur aus `createTask` aufgerufen (grep bestätigt: 1 call site).
- `createTask("Popup")` kommt nur aus dem Popup-Submit (`board.html:421`
  `validateAndCreateTask(event, 'Popup')`).
- `createTask("")` kommt aus `task.html`-Submit (`taskBackendRest.js:389`,
  `task2.js:271`); dort greift weiterhin der Redirect.

## Bekannte, bewusst nicht adressierte Fälle
- `deleteTask()` in `firebaseDatabaseFunctions.js:127` hat ebenfalls einen
  `window.location.href = "board.html"`, gehört aber zum Detail-Popup-Delete
  und nicht zum Add-Popup-Flow — auf spätere Anfrage verschoben.

## Manuelle Prüfung
- Board öffnen → "+"-Icon → Add-Task-Popup → Task erstellen → Toast erscheint
  für 3s → Popup schließt sich → neue Karte erscheint sofort in ihrer Spalte,
  ohne dass die Seite neu geladen wird.
