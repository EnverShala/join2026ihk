---
slug: contacts-420-ellipse-name-cleanup
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Contacts Detail @<421px: Ellipse-Groesse zurueck + Name-Layout aufraeumen

## Ziele

1. Ellipse (Avatar) soll unter 421px NICHT kleiner werden als bei @535px (dort 64x64 / font-size 32).
2. Ellipse hat visuell zu viel Abstand nach links (im centered Layout wirkt es, als hätte sie zu viel `margin-left`).
3. Abstand zwischen Ellipse und Namen soll weiter reduziert werden.
4. Name (`.span-contact-name`) soll einen Ticken kleiner werden.

## Root Cause

`contactsResponsive.css` @420px enthält aktuell:
```css
.contact-name-main-container { width: 320px; gap: 12px; }           /* base justify-content: center */
.contact-name-container       { margin-right: -50px; }
.ellipse                      { height: 48px; width: 48px; font-size: 28px; margin-right: -28px; }
.span-contact-name            { font-size: 30px; }
```

Probleme:
- Explizite Verkleinerung der Ellipse auf 48px überschreibt den @535px-Wert (64px). → Nutzer will das nicht.
- `.contact-name-main-container { justify-content: center }` aus dem Basis-Regelblock + der 320px feste Breite ergeben, dass der (schmalere) Inhalt zentriert wird → sichtbare Leerräume links UND rechts vom Ellipse+Name-Block.
- Die negativen `margin-right`-Tricks kompensieren das Centered-Layout, verschieben aber die Positionierung visuell.

## Änderungen

`contactsResponsive.css` @420px:

- `.contact-name-main-container` → `width: auto; gap: 8px; justify-content: flex-start; padding-left: 8px;` (weg vom Center-Layout, links-bündig, minimalgap).
- `.contact-name-container` → `margin-right: 0` (überschreibt bestehendes -50px).
- `.ellipse` → **Größen-Overrides entfernen** (`height`, `width`, `font-size`), sodass die @535px-Werte (64x64, font-size 32) durchgreifen. `margin-right: 0` setzen (überschreibt -28px).
- `.span-contact-name` → `font-size: 26px` (bisher 30px, „ein Ticken kleiner").

## Verifikation

- Contacts Detail @<421px: Ellipse bleibt bei 64x64, Name-Abstand zur Ellipse ist minimal (8px gap), Content sitzt links-bündig (kein Leerraum-Streifen mehr links), Name ist bei 26px.
