---
slug: edit-popup-mobile-typography-and-prio
date: 2026-07-09
type: quick
---

# Edit-Popup Mobile: Typography wie Add Task + Prio-Buttons breiter

## Probleme

1. **Schriftgrößen**: `boardResponsive.css` @576px setzt Edit-Popup Labels (`.editPopupTitelTxt`, `.editPopupDescriptionTxt`, `.editPopupDateTxt`, `.editAssignedToTxt`, `.editPopupSubtasksTxt`) auf `font-size: 14px`. Add Task hält Labels konstant bei 20px. Dadurch sieht der Edit-Popup auf Mobile deutlich anders aus.

2. **Prio-Buttons zu schmal**: Bei @480px:
   - `.editPrio { width: 200px }`
   - `.buttonsPrioOnEditPopUp { width: 200px; gap: 0 }`
   
   200px total für 3 Buttons → jeweils ~66px, Text „Urgent"/"Medium"/"Low" ragt raus.

## Fix

### `styles/boardResponsive.css` @576px
- Labels von 14px auf 20px anheben (parity zu Add Task, das keine Label-Verkleinerung im Mobile-Layout kennt).

### `styles/boardResponsive.css` @480px
- Neuer Regelsatz für Labels (bleiben 20px oder minimal reduziert, aber lesbar).
- `.editPrio { width: 280px }` (matcht die anderen Container-Breiten).
- `.buttonsPrioOnEditPopUp { width: 280px; gap: 4px }` (Buttons füllen die Breite via bereits globalem `.btn-prio { flex: 1; min-width: 0 }` aus `addTaskResponsive.css` @576px).

## Verification
- Board → Task-Karte → Edit auf Mobile 576px / 480px / 375px: Labels sichtbar (20px), Prio-Buttons haben Platz, „Urgent"/"Medium"/"Low" nicht abgeschnitten.
