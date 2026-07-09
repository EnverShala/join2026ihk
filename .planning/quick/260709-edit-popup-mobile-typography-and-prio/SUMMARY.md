---
slug: edit-popup-mobile-typography-and-prio
date: 2026-07-09
type: quick
status: complete
---

# Summary — Edit-Popup Mobile Typography + Prio-Buttons

## Changes (`styles/boardResponsive.css`)

### @576px
- Edit-Popup Labels (`.editPopupTitelTxt`, `.editPopupDescriptionTxt`, `.editPopupDateTxt`, `.editAssignedToTxt`, `.editPopupSubtasksTxt`) `font-size: 14px → 20px` (matcht Add Task, das Labels über alle Breakpoints bei 20px hält).

### @480px
- `.editPrio { width: 200px → 280px }` (matcht die anderen Container).
- `.buttonsPrioOnEditPopUp { width: 200px → 280px; gap: 0 → 4px }`.
- Neue Label-Overrides für Edit-Popup: `font-size: 18px` (proportional zur schmaleren 300px-Popup-Breite, deutlich näher an Add Task).

`.btn-prio` behält globale Regeln aus `addTaskResponsive.css` @576px (`flex: 1; min-width: 0; font-size: 16px`) und @376px (`font-size: 14px`), sodass die 3 Buttons jetzt in ~90px Slots + gap sitzen und „Urgent"/"Medium"/"Low" nicht mehr rausragen.

## Verification (visuell)

- Board → Task-Karte → Edit @576px: Labels 20px (wie Add Task), Prio-Buttons füllen 320px, Text passt.
- Board → Task-Karte → Edit @480px: Labels 18px, Prio-Container 280px, Buttons flex:1 mit lesbarem Text + Icon.
- Board → Task-Karte → Edit @375px: Prio-Buttons Font 14px (globaler Fallback), Layout bleibt kompakt.
