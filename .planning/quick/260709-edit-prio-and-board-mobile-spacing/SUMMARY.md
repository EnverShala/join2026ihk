---
slug: edit-prio-and-board-mobile-spacing
date: 2026-07-09
type: quick
status: complete
---

# Summary — Edit-Prio/Dropdown Width + Board Mobile Weißraum

## Changes (`styles/boardResponsive.css`)

### Edit-Popup Mobile: Prio + Dropdown fluchten mit Inputs

**@560px:**
- Neu: `.editDropdown { width: 300px }` — sorgt dafür, dass `#myDropdown.dropdown-content` (width: 100%) auf 300px kollabiert und mit dem 300px-Trigger fluchtet.
- `.editPrio { width: 320px → 300px }` — matcht die Input-Breite.

**@480px:**
- Neu: `.editDropdown { width: 255px }` — Dropdown-Alignment mit 255px-Trigger.
- `.editPrio { width: 280px → 255px }` — matcht Input-Breite.
- `.buttonsPrioOnEditPopUp { width: 280px → 255px }` (spätere Occurrence im Block, überschreibt frühere 260px-Regel ohnehin).

Wirkung: Beim Öffnen der Assigned-To-Liste im Edit-Popup ist die Dropdown-Breite jetzt identisch mit der Trigger-Breite und den Input-Feldern. Die 3 Prio-Buttons füllen exakt die gleiche Breite wie Title/Description/Assigned-to-Inputs.

### Board Mobile: engerer Header + weniger Bottom-Space

**@800px** (bestehender `.boardSection`-Block erweitert):
- Neu: `.boardHeader { height: auto }` — statt fixer 180px aus `board.css`. Header schrumpft auf Content-Höhe (h1 „Board" + Search-Container).
- Neu: `.statuses { margin-top: 16px; margin-bottom: 112px }` — overrided die @1180px-Regel (50/200). 112px = ~96px fixierte Mobile-Nav-Höhe + 16px Puffer, damit die letzte Task-Karte nicht unter der Nav verschwindet aber ohne den 200px-Overhead.

## Verification (visuell)

- Board → Task-Karte → Edit @480px / @375px: Prio-Container = Inputs = 255px. Assigned-To öffnen → Dropdown-Liste exakt so breit wie Trigger.
- Board → Task-Karte → Edit @560px: Alle Widths 300px, geöffnete Dropdown-Liste fluchtet mit Trigger.
- Board-Seite @480px / @375px: Deutlich weniger Luft zwischen „Board" und erster To-Do-Karte. Letzte Done-Karte sitzt kompakt oberhalb der Bottom-Nav mit kleinem Puffer.
