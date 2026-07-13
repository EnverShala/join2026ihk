---
name: Notebook Responsive + Textarea + JSDoc-Standard-Refactor
description: Description-Feld auf textarea umgestellt, Popups notebook-tauglich, globale Variablen konsolidiert, JSDoc nach jsdoc.app-Standard mehrzeilig, Funktionen ≤14 Zeilen
status: complete
date: 2026-07-13
---

## 1. Description-Feld: input → textarea

- `task.html:164`: `<input id="description" class="inputDescription" .../>` → `<textarea>...`
- `board.html:434` (Add-Task-Popup): `<input id="description" class="inputPopup" .../>` → `<textarea>...`
- `board.html:318` (Edit-Popup): `<input id="inputDescription" class="editDescriptionInput" type="text">` → `<textarea>...`
- `styles/addTask.css .inputDescription`: `min-height: 120px; resize: vertical; box-sizing: border-box` ergänzt; neue `textarea.inputDescription` mit `vertical-align: top`, `line-height: 1.4` und `:focus`-State.
- `styles/boardInput.css`: neue Regeln `textarea.inputPopup` (min-height 96px, resize: vertical) und `textarea.editDescriptionInput` (analog + `font-family: inherit`).

## 2. Notebook-Responsive-Fixes für Popups

Problem: bei kleinen Notebook-Höhen (720–800 px) wurden die Task-Popups oben abgeschnitten, weil `max-height: 80%` in Kombination mit `align-items: center` das Popup mittig zentrierte, ohne dass `overflow-y: auto` griff.

Fixes:
- `styles/boardInput.css #myModal`:
  - Höhe: `max-height: 80%` → `max-height: min(90vh, calc(100dvh - 32px))`
  - Positionierung: `position: absolute; top/left/right/bottom: 0` → `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`
  - `overflow-y: auto; overflow-x: hidden; box-sizing: border-box` neu.
- `styles/boardPopup.css .popupOnTaskSelectionMainContainer, .popupOnTaskEdit`:
  - `max-height: 80% !important` → `max-height: min(90vh, calc(100dvh - 32px)) !important`
  - `justify-content: center` → `flex-start` (Popup startet oben statt zentriert – oberer Teil bleibt immer sichtbar bei Overflow)
  - `overflow-x: hidden; box-sizing: border-box` ergänzt.
- `styles/boardResponsive.css`: bei `@media (max-width: 1180px)` und `@media (max-width: 480px)` die alten `height: 80%`-Werte durch `max-height: min(90vh, calc(100dvh - 32px)); overflow-y: auto` ersetzt.

## 3. Globale Variablen konsolidiert am Dateianfang

Alle 15 JS-Dateien wurden auf Modul-Level-Deklarationen geprüft. Reihenfolge einheitlich: `const` zuerst, dann `let`, jeweils logisch gruppiert.

- `js/boardDialogs.js`: `CARD_CONTAINER_MAP` von Zeile ~160 an den Dateianfang verschoben.
- `js/summary.js`: `months`-Array aus `numberToDate` als `const SUMMARY_MONTHS` an den Dateianfang gezogen.
- `js/firebaseDatabaseFunctions.js`: `FIREBASE_URL` (const) + `users`, `tasks`, `accounts`, `login`, `currentUser`, `currentId` (let) — bereits oben, jetzt formalisiert.
- `js/taskAttachments.js`: Reihenfolge korrigiert (`_ALLOWED_MIME`, `_ALLOWED_EXT`, `_MAX_BYTES`, `_MAX_DIMENSION` als const, danach `_taskAttachments`, `_editAttachments`, `_viewAttachments`, `_currentLightboxIndex` als let).
- Rest hatte keine relevanten Modul-Level-Vars oder war bereits sauber.

## 4. JSDoc-Kommentare auf jsdoc.app-Standard mehrzeilig neu

Alle einzeiligen JSDoc-Blöcke der letzten Session wurden ersetzt durch mehrzeilige Blöcke nach dem offiziellen Standard:

```javascript
/**
 * Kurze Beschreibung mit Punkt am Ende.
 *
 * @param {string} name - Beschreibung des Parameters.
 * @param {number} [count=0] - Optionaler Parameter mit Default.
 * @returns {boolean} Beschreibung des Rückgabewerts.
 */
```

Regeln durchgängig angewandt:
- Erste Zeile: kurze Beschreibung mit Punkt am Ende, danach eine leere ` *`-Zeile.
- `@param {Type} name - description` (Dash zwischen Name und Beschreibung).
- `@returns` statt `@return`, `Promise<T>` bei async-Funktionen mit Rückgabewert.
- Optionale Parameter mit `[name]` bzw. `[name=default]`-Notation.
- Keine Emojis, keine Autor-Tags, keine Inline-Kompression.

Insgesamt **rund 240 Funktionen** über alle 15 Dateien neu dokumentiert.

## 5. Lange Funktionen aufgeteilt (Body ≤ 14 Zeilen)

Neu extrahierte Helper (Auswahl):
- `board.js`: `_levelUp`, `_levelDown`, `_uncheckSubtask`, `_checkSubtask`
- `boardPopup.js`: `_wireModalOpenButtons`, `_wireModalCloseButtons` (aus DOMContentLoaded-Callback)
- `firebaseDatabaseFunctions.js`: `mapUserRecord`, `mapAccountRecord`, `mapTaskRecord`, `tryActivateRemembered`, `getAccountInitialsState`, `showHeaderIcons`, `buildGuestLoginLink`, `markAllNavLinksActive`, `isCurrentlyLoggedIn`, `applyGuestNavLayout`, `postData`
- `firebaseUserRendering.js`: `readEditUserForm`, `buildContactsHtml`, `fillContactDetailFields`, `applyContactDetailColor`
- `taskUIandBackend.js`: `getUniqueAssignedNames`, `applyListItemSelectedStyle`, `syncSelectedContactChip`, `hideRequiredHints`, `resetPrioButton`, `activatePrioButton`
- `taskAttachments.js`: `_updateLightboxDownload`, `_updateLightboxNav`
- `taskBackendRest.js` + `task2.js`: `runAllTaskValidators`
- `contacts.js`: `_isContactFieldValid`, `_injectPopupHtml`, `_fillEditPopupFields`
- `summary.js`: `_getGreetingByHour`
- `sidebarHeader.js`: `_initSidebarHeader` (Event-Handler-Body extrahiert)
- `templates.js`: `_taskCardTopTemplate`, `_taskCardBodyTemplate`

Alle Funktionsbodies sind jetzt ≤14 Zeilen (Template-HTML-Strings in `templates.js` ausgenommen).

## Sanity Check

`node --check` grün für alle 15 JS-Dateien. Keine Namen von exportierten Funktionen oder globalen Variablen geändert. Zeilenanzahl gesamt: 3636 → ca. 4134 (Wachstum durch mehrzeilige JSDoc-Blöcke, kein Logik-Change).

## Test-Hinweise

- **Add Task / Edit Task**: Description-Feld ist jetzt textarea, mehrzeilig eingebbar, vertikal resizbar.
- **Board-Popups auf Notebook** (1366×768, 1280×720, 1440×900): Task-Detail-Popup und Edit-Popup passen ins Viewport, oberer Rand sichtbar, interner Scroll wenn Inhalt zu lang.
- **Add-Task-Popup** (Board): scrollt intern statt oben abgeschnitten zu werden.
- **Signup / Login / Summary / Contacts**: Verhalten unverändert.
- **Attachments Upload + Lightbox**: Preview + Navigation funktionieren wie zuvor.
- **Subtask add/edit/confirm/cancel**: Enter/Escape-Handling unverändert.

## Follow-up-Fixes (nach initialer Test-Runde)

### 6. Bugfix: activatePrioButton-Namenskollision (Edit-Popup TypeError)

Nach Öffnen einer Task-Karte im Board und Klick auf Edit:
`taskUIandBackend.js:131 Uncaught TypeError: Cannot set properties of null (setting 'className')`.

Ursache: sowohl `board.js` als auch `taskUIandBackend.js` definierten eine globale Funktion `activatePrioButton` mit unterschiedlichen Signaturen (Prio-Label "Urgent" vs. Prio-Key "urgent"). Da beide Skripte im Board geladen werden, überschrieb der zuletzt geladene den ersten.

Fix: Helper in `taskUIandBackend.js` in `_setPrioButtonActive(name, activeClass, id)` umbenannt (mit Null-Guard). Aufrufer in `clickOnUrgent`, `clickOnMedium`, `clickOnLow` angepasst. Die `board.js`-Funktion `activatePrioButton(prioName, id)` (Label-Router) bleibt unter altem Namen.

### 7. taskBackendRest.js: DOMContentLoaded-Body ausgelagert

Der frühere Listener enthielt sämtliche Subtask-Handler und behielt so einen Body von ~120 Zeilen. Alle Funktionen jetzt auf Top-Level, JSDoc jeder Funktion mehrzeilig nach Standard. Der Listener ruft nur noch `initSubtaskUI` (bzw. `initDueDateMin`) auf.

DOM-Referenzen (`_subtaskInput`, `_subtaskBtnAdd`, `_subtaskBtnCheckCancel`, `_subtaskCancelBtn`, `_subtaskCheckBtn`) und das Subtask-Array (`_subtasks`) sind jetzt Modul-Level-Variablen ganz oben. `_cacheSubtaskRefs` initialisiert sie beim DOMContentLoaded. Bei fehlendem Input-Feld (`initSubtaskUI` wird auch auf Board geladen) bricht die Init sicher ab.

Neu extrahierte Helper: `_cacheSubtaskRefs`, `_resetSubtaskInputMode`, `_persistSubtaskEdit`, `_onSubtaskInputKeydown`, `_wireSubtaskConfirmTriggers`, `_installSubtasksResetHook`, `initSubtaskUI`, `initDueDateMin`.

### 8. Add-Task in `<form novalidate>` gewrappt

`task.html`:
- `<form>` → `<form id="addTaskForm" novalidate onsubmit="validateAndCreateTask(event); return false;">`
- `</form>` verschoben ans Ende (bottom-form-Actions liegen jetzt im Form).
- Create-Button: `type="button"` mit inline `onclick` → `type="submit"` (Handler am Form).

Damit funktioniert Enter im Feld → Submit → Custom-Validation (die HTML5-Validierung ist per `novalidate` deaktiviert; die vorhandenen `#*-required`-Fehlermeldungen werden weiterhin über `validateAndCreateTask` gesteuert).

### 9. Textarea-Breite an .input angeglichen

`.inputDescription` hatte `box-sizing: border-box` (aus dem textarea-Fix), `.input` hat `content-box` (Default). Dadurch war die textarea 44px schmaler als die anderen Felder. Fix: `.inputDescription { box-sizing: content-box }`. Damit ist die Gesamtbreite beider Feldtypen identisch.

### 10. Leere Subtasks im Board-Popup blockieren

`confirmSubtaskEditPopup(position)` in `boardPopup.js` prüfte den Trim-Wert nicht. Fix: Bei leerem Input wird jetzt `cancelSubtaskEditPopup(position)` aufgerufen und die Bearbeitung verworfen — analog zu `confirmSubtaskEdit` in `board.js`.

Andere Pfade (`addNewSubtask`, `addSubtaskPopup`, `addSubtask` in `taskBackendRest.js`) prüfen bereits `.trim() != ""`.

## Sanity Check (Follow-up)

- `node --check` grün für `board.js`, `boardPopup.js`, `taskBackendRest.js`, `taskUIandBackend.js`, `task2.js`.
- `taskBackendRest.js`: alle Funktionen top-level, DOMContentLoaded ruft nur `initSubtaskUI` / `initDueDateMin`. Jeder Body ≤14 Zeilen.
- Edit-Task-Popup öffnet ohne TypeError (activatePrioButton).

### 11. firebaseDatabaseFunctions.js gesplittet (Zeilen-Limit ≤400)

`firebaseDatabaseFunctions.js` war 519 Zeilen. UI-Layer-Funktionen (Header-Initialen, Nav-Aktivierung, Guest-View-Layout) in eine neue Datei `js/navigationAndHeader.js` ausgelagert.

**`js/navigationAndHeader.js`** (162 Zeilen, 11 Funktionen):
- `loadAccountInitials`, `getAccountInitialsState`, `showHeaderIcons`
- `fitNameToContainer`
- `markActiveNavLink`, `injectGuestLoginLink`, `buildGuestLoginLink`
- `hideNavIfNotLoggedIn`, `markAllNavLinksActive`, `isCurrentlyLoggedIn`, `applyGuestNavLayout`

**`js/firebaseDatabaseFunctions.js`** (366 Zeilen, 25 Funktionen): behält alle Firebase-CRUD-, Auth- und Session-Funktionen (loadUsers, loadTasks, loadAccounts, saveTasks, editTask, deleteTask, postData, loginUser, signUpUser, registerUser, addUser, loginOnInput, rememberUserAccount, dontRememberUserAccount, isEmailValid, logInUserAccount, logOutUserAccount, getLoggedInUser, indexHtmlInit etc.).

Alle 14 HTML-Files (`addContacts.html`, `board.html`, `contacts.html`, `editContacts.html`, `help.html`, `index.html`, `legalNotice.html`, `login.html`, `privacy.html`, `sidebar-desktop.html`, `sidebar-header.html`, `signup.html`, `summary.html`, `task.html`) bekommen zusätzlich `<script src="./js/navigationAndHeader.js"></script>` direkt nach `firebaseDatabaseFunctions.js`.

**Sanity**: `node --check` grün für beide Dateien, alle exportierten Namen unverändert.
