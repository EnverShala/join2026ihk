---
slug: contacts-420-ellipse-name-cleanup
date: 2026-07-10
type: quick
status: complete
---

# Summary — Contacts Detail @<421px: Ellipse + Name-Layout

## Changes

**`styles/contactsResponsive.css`** — `@media (max-width: 420px)`:

- `.contact-name-main-container` → `width: auto; gap: 8px; justify-content: flex-start; padding-left: 8px;` (bisher `width: 320px; gap: 12px`; die base-`justify-content: center` griff, was zu Leerraum links vor der Ellipse führte).
- `.contact-name-container` → `margin-right: 0` (bisher `-50px`; Kompensation für Center-Layout jetzt überflüssig).
- `.ellipse` → **Größen-Overrides entfernt** (bisher `height: 48px; width: 48px; font-size: 28px`). Damit greifen die Werte aus `@media (max-width: 535px)` durch: **64x64, font-size 32**. `margin-right: 0` (bisher `-28px`).
- `.span-contact-name` → `font-size: 26px` (bisher 30px).

## Verifikation

- Contacts Detail @375px: Ellipse ist wieder 64x64 (nicht mehr geschrumpft), sitzt links-bündig ohne visuelle Leerspalte, Name mit 8px Gap direkt daneben, Name in 26px („ein Ticken" kleiner).

## Geänderte Dateien

- `styles/contactsResponsive.css` (@420px-Block)
