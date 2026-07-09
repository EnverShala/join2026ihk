---
slug: anhaenge-margin-and-mobile-typography
date: 2026-07-09
type: quick
---

# Task-Popup „Anhänge": mehr Abstand oben + Mobile-Typografie

## Problem

Beim Öffnen einer Task-Karte (View-Popup):

1. **Zu wenig Abstand zwischen Subtasks-Liste und „Anhänge"-Header.** `.attachmentsMainContainer` hat `margin-top: 20px` (`styles/boardPopup.css:481`). Zusammen mit dem 10px bottom-margin von `.subtasksTxt` ergibt sich ein visuell zu enger Übergang von der Subtasks-Liste zum Anhänge-Abschnitt.

2. **„Anhänge" ist auf Mobile kleiner als „Subtasks" / „Assigned to".** `styles/bordDialogsResponsive.css:62` setzt `.attachmentsTxt { font-size: 14px }` @427px. `.subtasksTxt` und `.assignedToTxt` bleiben aber bei 20px — Inkonsistenz.

## Fix

### `styles/boardPopup.css`
- `.attachmentsMainContainer { margin-top: 20px → 28px }` — mehr Puffer über dem Anhänge-Header.

### `styles/bordDialogsResponsive.css` @427px
- `.attachmentsTxt { font-size: 14px }` entfernen, sodass die Basis-Regel (20px, `font-weight: 400`, `line-height: 24px`) auf Mobile weiter greift — parity zu `.subtasksTxt` und `.assignedToTxt`.
- `.attachment-list-name` bleibt bei 14px (Dateinamen-Größe im Listeneintrag, davon nicht betroffen).

## Verification

- Board → Task-Karte öffnen (Desktop): „Anhänge"-Header hat mehr Luft zur Subtasks-Liste.
- Board → Task-Karte öffnen @375px / @427px: „Anhänge" gleiche Schriftgröße/Weight/Line-Height wie „Subtasks" und „Assigned To" (20px / 400 / 24px). Dateinamen darunter bleiben 14px.
