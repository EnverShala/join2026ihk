---
phase: quick
plan: 260717-fv0
subsystem: responsive-css
tags: [forced-mobile, addtask, media-query, sidebar]
requires: []
provides:
  - "AddTask-Inhalt auf forced-mobile Geraeten (portrait, touch, 801-1280px) horizontal zentriert"
affects: [task.html-layout]
tech-stack:
  added: []
  patterns:
    - "Sidebar-Margin-Kompensation nur unter identischer Sichtbarkeits-Query wie sidebarHeader.css (not forced-mobile)"
key-files:
  created: []
  modified:
    - styles/addTaskResponsive.css
decisions:
  - "margin-left: 0 explizit im OR-Block gesetzt (statt Deklaration nur zu entfernen), damit die Basis-Regel addTask.css:72 (300px) nicht durchschlaegt"
  - "Neuer Kompensations-Block direkt nach dem Mobile-OR-Block platziert — gleiche Spezifitaet, spaetere Regel gewinnt bei 801-1023px-Desktop"
metrics:
  duration: "~10 min"
  completed: "2026-07-17"
---

# Quick Task 260717-fv0: AddTask forced-mobile Zentrierung Summary

AddTask-Formular auf forced-mobile Geraeten (Portrait-Touch 801-1280px, z.B. iPad Pro portrait) horizontal zentriert, indem die 240px-Sidebar-Kompensation an die tatsaechliche Sidebar-Sichtbarkeit gekoppelt wurde.

## Was geaendert

**styles/addTaskResponsive.css** (einzige Datei, Commit `65bcff4`):

1. Im OR-Block `@media (max-width: 1023px), ((orientation: portrait) and (pointer: coarse) and (max-width: 1280px))`: `.taskContainer { margin-left: 240px }` → `margin-left: 0`. Explizites 0 noetig, weil addTask.css:72 sonst 300px liefert.
2. Neuer Block direkt danach:
   ```css
   @media (min-width: 801px) and (max-width: 1023px) and (not ((orientation: portrait) and (pointer: coarse) and (max-width: 1280px))) {
       .taskContainer { margin-left: 240px; }
   }
   ```
   Identische forced-mobile Bedingung wie sidebarHeader.css:37 — Kompensation gilt nur, wenn die Desktop-Sidebar sichtbar ist.

`grep -c "margin-left: 240px"` in addTaskResponsive.css = 1 (nur im neuen Block). flex/justify-content/margin-bottom und `.btn-subtask` im OR-Block unveraendert.

## Playwright-Regressionsmatrix (msedge, lokaler Static-Server, task.html)

| # | Konfiguration | hasTouch | margin-left | Form-Center | Sidebar | Ergebnis |
|---|---------------|----------|-------------|-------------|---------|----------|
| 1 | 1024x1366 iPad Pro portrait | true | 0px | 512.0 (= Viewport-Mitte) | hidden | PASS |
| 2 | 900x1280 Tablet portrait | true | 0px | 450.0 (= Viewport-Mitte) | hidden | PASS |
| 3 | 390x844 Phone | true | 0px | 195.0, scrollWidth 390 (kein Overflow) | hidden | PASS |
| 4 | 900x700 schmales Desktop-Fenster | false | 240px | 570.0 | visible | PASS |
| 5 | 1280x800 Desktop landscape | false | 264px | 664.0 | visible | PASS |
| 6 | 1440x900 Desktop | false | 300px | 840.0 | visible | PASS |

Alle 6 Faelle PASS — forced-mobile zentriert (Abweichung Form-Mitte zu Viewport-Mitte 0px), keine Regression bei Real-Mobile, schmalem Desktop oder Desktop.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None (CSS-only, keine neuen Endpunkte/Auth/Dateizugriffe).

## Self-Check: PASSED

- styles/addTaskResponsive.css geaendert und committed (65bcff4) — FOUND
- Playwright-Matrix 6/6 PASS
