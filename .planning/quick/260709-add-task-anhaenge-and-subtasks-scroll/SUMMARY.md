---
slug: add-task-anhaenge-and-subtasks-scroll
date: 2026-07-09
type: quick
status: complete
---

# Summary — Anhänge dichter + Subtasks scrollbar

## Changes

- `styles/addTask.css`: `.container-subtasks-display` bekommt `max-height: 150px; overflow-y: auto` → deckt Add Task page und Edit-Popup (`#subtaskListPopup`) ab.
- `styles/boardPopup.css`: `#showSubtasksContainer.subtasks` → `max-height: 120px; overflow-y: auto` für Task-View-Popup (Card-Klick).
- `styles/addTaskResponsive.css` (`@media (max-width:800px)`):
  - `.container-subtasks-display` max-height auf 130px reduziert.
  - Subtask-`ul` `margin-top` von 20px auf 8px im Mobile-Kontext.
  - Anhänge-`.inputGroup` (via `:has(> .attachment-upload-container)`) `margin-top: -8px`.
  - `.attachment-upload-container` margin auf 0 → sitzt sichtbar dichter am darüberliegenden Feld.

## Verification (visuell)

- Add Task: 4+ Subtasks anlegen → Liste scrollt bei ~3 Items, Form bleibt kompakt.
- Board → Task-Karte → View: `#showSubtasksContainer` scrollt bei vielen Subtasks.
- Board → Task-Karte → Edit: dieselbe Scroll-Region wie Add Task.
- Add Task Mobile (≤800px): Anhänge rutscht deutlich näher an den Subtask-Block.

## Follow-ups

- Kein Bedarf. `:has()` wird von allen Ziel-Browsern (Chromium ≥105, Safari ≥15.4, Firefox ≥121) unterstützt.
