---
name: Signup Overflow + JS Refactor
description: Signup Mobile-Input-Overflow behoben, JSDoc gekürzt, Templates zentralisiert, Funktionen <= 16 Zeilen
status: complete
date: 2026-07-13
---

## Änderungen

### 1. Signup Mobile Input-Overflow behoben
- `styles/signup.css`:
  - `.input__box`: `box-sizing: border-box; max-width: 100%` hinzugefügt, damit Input-Boxen nie über den Container hinausragen.
  - `.input__box input`: Base-Width von `calc(422px - 21px)` auf `width: 100%; min-width: 0; box-sizing: border-box` umgestellt.
  - Neue Regel unter `@media (max-width: 615px)`: `.input__box`-Varianten bekommen `width: 88%; max-width: 100%; padding: 10px 18px` – schließt die Lücke zwischen 601–615px, in der Input-Boxen zuvor breiter waren als die Registration-Box.

### 2. JSDoc-Kommentare gekürzt (alle 15 JS-Dateien)
- Mehrzeilige JSDoc-Blöcke mit `@param` + `@returns` durchgängig zu einzeiligen `/** ... */`-Kommentaren zusammengefasst.
- Betroffene Dateien: `board.js`, `boardDialogs.js`, `boardPopup.js`, `contacts.js`, `firebaseUserRendering.js`, `login.js`, `signup.js`, `summary.js`, `task2.js`, `taskBackendRest.js`, `taskUIandBackend.js`, `templates.js`.
- Ergebnis: Gesamt-JS von **3636 → 2845 Zeilen** (~22 %).

### 3. Templates aus taskAttachments.js in templates.js verschoben
- Neue Templates in `templates.js`:
  - `attachmentPreviewItemTemplate(att, i, context)` (ex `_buildPreviewItemHtml`)
  - `attachmentListItemTemplate(att, i)` (ex `_buildListItemHtml`)
- In `taskAttachments.js` durch Aufrufe der neuen Template-Funktionen ersetzt; interne Helper entfernt.

### 4. Funktionen über 16 Zeilen gekürzt
Kompakter geschrieben oder in Helper aufgeteilt:
- `board.js`: `renderSubtasks`, `subtaskOnKeyDown`, `subtaskOnKeyDownPopup`.
- `boardDialogs.js`: `editCurrentTask`, `popupValueImplementFromTask` (+ neuer Helper `buildContactEllipseHtml`), `renderSubtasksDoneCheckboxes`, `renderTaskCards`, `renderTaskCardUserCircles`.
- `boardPopup.js`: `searchTasks`.
- `firebaseDatabaseFunctions.js`: `signUpUser`, `loadAccountInitials`, `hideNavIfNotLoggedIn`.
- `firebaseUserRendering.js`: `renderContacts`, `loadUserInformation`.
- `signup.js`: `checkSignUpConditions`, `checkEmail`, `checkPassword`, `checkName` (gemeinsamer Helper `_applySignupFieldState` extrahiert).
- `summary.js`: `loadSummaryInfos`, `getUpcomingDeadline`, `greetUser`.
- `taskUIandBackend.js`: `createTask` (+ neuer Helper `readTaskFormValues`), `renderAssignedTo`, `toggleBackground`.
- `task2.js` und `taskBackendRest.js`: `styleSubtaskInput`, `editSubTask`, `confirmSubtaskEdit` (jeweils mit lokalen Helper-Funktionen `showSubtaskInputMode`, `_switchSubtaskItemToInput`).

Alle regulären Funktionen (ohne die HTML-Template-Strings in `templates.js`) sind jetzt ≤ 16 Zeilen.

## Sanity Check
- `node --check` (via `new Function()`) für alle 15 JS-Dateien: OK.
- Zeilenreduktion: 3636 → 2845 (–791 Zeilen).

## Test-Hinweise
- Signup auf 320–615px Viewport prüfen: Input-Boxen bleiben komplett innerhalb der `registration__box`, mit horizontalem Abstand.
- Board: Task-Karten rendern, Kontakte-Kreise, Assigned-Dropdown, Attachments-Preview + Lightbox.
- Summary: Counts, Deadline und Greeting.
- AddTask / EditTask: Subtask-Add/-Edit/-Confirm/-Delete auf Board und Popup.
