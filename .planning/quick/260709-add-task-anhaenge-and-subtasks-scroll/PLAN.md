---
slug: add-task-anhaenge-and-subtasks-scroll
date: 2026-07-09
type: quick
---

# Add Task: Anhänge dichter + Subtasks scrollbar

## Goal

1. **Mobile (`≤800px`) Add Task:** `Anhänge`-Bereich näher an das darüberliegende Feld rücken.
2. **Überall (Add Task, Edit Task Popup, Task-View Popup):** Subtask-Liste wird beim Wachsen scrollbar (~3 Items sichtbar), sodass der Container nicht mit wächst.

## Contexts / Selectors

- Add Task page (`task.html`):
  - Subtaskliste: `.container-subtasks-display > ul.list-subtasks` (`#subtaskList`)
  - Anhänge Group: `.inputGroup` das die `.attachment-upload-container` enthält
- Edit Task popup (`board.html`): `.container-subtasks-display > ul.list-subtasks` (`#subtaskListPopup`) — selber Selector.
- View Task popup / Card-Klick (`board.html`): `#showSubtasksContainer.subtasks`

## Changes

### A) `styles/addTask.css`

`.list-subtasks` scrollbar machen (deckt Add Task + Edit Popup ab):

```
.container-subtasks-display {
  max-height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
}
```

Grund: `.container-subtasks-display ul { margin-top: 20px }` bleibt – wir cappen den Container statt der `ul`, damit der `margin-top` weiterhin ok ist.

### B) `styles/boardPopup.css`

View-Popup (`#showSubtasksContainer.subtasks`) scrollbar:

```
#showSubtasksContainer.subtasks {
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
}
```

### C) `styles/addTaskResponsive.css` (`@media (max-width: 800px)` block)

Anhänge näher heranrücken:

```
.attachment-upload-container { margin-top: 0; margin-bottom: 0; }
```

und den umliegenden `.inputGroup` mit `.attachment-upload-container` leicht anheben, da im Mobile-Layout die `.inputGroup`s direkt aneinanderstoßen und der Subtask-Container darüber bereits `margin-top: 20px` auf der ul hat. Reduziere zusätzlich `.container-subtasks-display ul { margin-top }` im Mobile-Kontext.

## Out of scope

- Edit-Feld einzelner Subtasks (Inline-Editing) — Höhen bleiben unverändert.
- Board-Karten-Rendering (Fortschrittsbalken etc.).

## Verification

- Add Task page (Desktop + Mobile): 4+ Subtasks hinzufügen → Bereich wird scrollbar, Form bleibt kompakt.
- Board → Task-Karte anklicken (View): Task mit ≥4 Subtasks → `#showSubtasksContainer` scrollt.
- Board → Task-Karte → Edit: 4+ Subtasks anlegen → scrollt.
- Add Task Mobile (≤800px): Anhänge sitzt sichtbar dichter am Subtask-Bereich.
