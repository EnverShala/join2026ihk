---
type: quick-plan
slug: board-popup-add-no-reload
quick_id: 260714-urx
created: 2026-07-14
status: in-progress
---

# Quick Task: Kein Board-Reload nach Add-Task-Popup

## Kontext
Aktueller Flow: `board.html` → "+"-Button öffnet `<dialog id="myModal">` → Formular submit
→ `validateAndCreateTask(event, 'Popup')` → `createTask('Popup')`
→ `saveTasks(...)` → `showSuccessMessage()` → nach 3s `window.location.href = "board.html"`
(voller Reload).

Gewünscht: Popup schließen, Board ohne Reload aktualisieren.

## Betroffene Datei
- `js/taskUIandBackend.js`
  - `createTask(id)` – Aufrufer der Success-Message
  - `showSuccessMessage()` – enthält den Redirect

## Existierender No-Reload-Pfad zum Nachbauen
`editCurrentTask()` in `js/boardDialogs.js:60`:
```js
await editTask(currentId, newTask);
await renderTaskCards();
closeDialog();
```
Gleiches Muster für den Add-Popup-Flow verwenden.

## Plan
1. `showSuccessMessage()` bekommt Parameter `id` (`""` = Standalone-Task-Seite, `"Popup"` = Board-Popup).
2. Toast wie bisher 3s anzeigen. Nach 3s:
   - Toast ausblenden.
   - Wenn `id === "Popup"`: Dialog schließen (`modal.close()` + vorhandenes `closeModal()`), dann `await renderTaskCards()`. Kein Redirect.
   - Sonst: bestehendes Verhalten (`window.location.href = "board.html"`).
3. `createTask(id)` reicht `id` an `showSuccessMessage(id)` durch.

## Nicht in scope
- `deleteTask()` in `firebaseDatabaseFunctions.js:127` hat ebenfalls einen
  `window.location.href = "board.html"`, gehört aber nicht zum Popup-Add-Flow.
  Nur anfassen, wenn separat angefragt.
- Kein Refactor der Toast-Position oder Timing. UX bleibt konsistent zu
  Standalone-`task.html`.
