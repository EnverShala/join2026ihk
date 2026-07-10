---
slug: summary-fixed-header-contacts-detail-gap
date: 2026-07-10
type: quick
status: complete
---

# Summary — Summary Mobile Fixed Header + Contacts Detail Ellipse-Gap

## Changes

### 1. Summary Mobile: fixer Header + Content ohne Scroll

**`summary.html`** — `<body>` bekommt `class="body-fixed-chrome"` (Klasse existiert bereits aus vorigem Quick-Task; sie fixiert den Mobile-Header und setzt `body { padding-top: 88px }` auf Mobile).

**`styles/summary.css`**
- `@media (max-width: 800px)`: 
  - `.main__container` → `height: calc(100dvh - 88px - 96px); overflow: hidden; align-items: center; margin-top: 0; margin-bottom: 0` — Container füllt exakt den Raum zwischen fixem Header (88px) und fixer Bottom-Nav (96px), `overflow: hidden` verhindert Scrollen.
  - `.summary__container` → `margin-top: 0` (bisher `-100px` — überlappte damals den fließenden Header; nicht mehr nötig).
  - Neu: `.summary__header { height: auto; margin-bottom: 24px }` (überschreibt die 80px aus @920px, macht den Header kompakter).
  - Neu: `.summary__tiles__container { gap: 16px }` (statt 28px in der Basis; reduziert vertikale Höhe).
- `@media (max-width: 450px)`: `.main__container { height: calc(100dvh - 88px - 96px); margin-top: 0; margin-bottom: 0 }` (bisher fixe 480px Höhe + 95px margin-top — bläht das Layout unnötig auf).
- `@media (max-width: 800px) and (min-height: 667px) and (max-height: 823px)`: `.summary__container { margin-top: 0 }` (bisher `-100px`).

### 2. Contacts Detail-View @<421px: Ellipse ↔ Name enger

**`styles/contactsResponsive.css`** — `@media (max-width: 420px)`:
- `.contact-name-main-container { gap: 32px → 12px }` — deutlich weniger Abstand zwischen Avatar-Ellipse und Namens-Container. Die bestehenden negativen Margins (`.contact-name-container margin-right: -50px`, `.ellipse margin-right: -28px`) bleiben unverändert, sie schrumpfen das Overall-Layout auf schmalen Geräten.

## Verifikation

- Summary @375x667 Mobile: Header oben fix, Bottom-Nav unten fix, Tiles-Bereich dazwischen ohne Scrollbalken.
- Contacts Detail-View @<421px: Ellipse und User-Name sitzen sichtbar dichter beieinander (12px statt 32px Gap).

## Geänderte Dateien

- `summary.html` (`class="body-fixed-chrome"`)
- `styles/summary.css` (3 Mobile-Blöcke)
- `styles/contactsResponsive.css` (@420px gap)
