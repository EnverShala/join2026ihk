---
slug: anhaenge-margin-and-mobile-typography
date: 2026-07-09
type: quick
status: complete
---

# Summary — Task-Popup „Anhänge": Abstand + Mobile-Typografie

## Changes

### `styles/boardPopup.css`
- `.attachmentsMainContainer { margin-top: 20px → 28px }` — spürbar mehr Puffer zwischen Subtasks-Liste und Anhänge-Header (+8px).

### `styles/bordDialogsResponsive.css` @427px
- `.attachmentsTxt { font-size: 14px }`-Override entfernt. Auf Mobile greift jetzt die Basis-Regel (`font-size: 20px; font-weight: 400; line-height: 24px`) — visuelle Parität zu `.subtasksTxt` und `.assignedToTxt`.
- `.attachment-list-name` bleibt bei 14px (Dateinamen im Listeneintrag).

## Verification (visuell)

- Board → Task-Karte öffnen (Desktop): sichtbar mehr Luft über dem „Anhänge"-Header.
- Board → Task-Karte öffnen @427px / @375px: „Anhänge", „Subtasks" und „Assigned To" haben identische Typografie (20px). Datei-Chip-Text darunter unverändert 14px.
