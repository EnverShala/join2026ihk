---
slug: summary-fixed-header-contacts-detail-gap
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Summary Mobile Fixed Header + Contacts Detail-View Ellipse-Gap

## Ziele

1. **Summary Mobile**: `.mobile-header` fixiert (immer sichtbar), Content passt ohne Scroll in den Viewport zwischen fixem Header und fixer Mobile-Nav.
2. **Contacts Detail-View @<421px**: Gap zwischen Ellipse und Namens-Container reduzieren.

## Analyse

### Ziel 1 — Summary

Aktuell in `summary.css`:
- `.main__container { display: flex; justify-content: center; margin-left: 0 }` @800px.
- `.summary__container { transform: scale(0.9); margin-top: -100px }` @800px — negative Margin überlappt den (bisher fließenden) Mobile-Header.
- `.main__container { height: 480px; margin-top: 95px }` @450px.
- `@media (max-width: 800px) and (min-height: 667px) and (max-height: 823px) { .summary__container { margin-top: -100px } }` — Duplizierung des Wertes.

Grund für die -100px: Der Mobile-Header lag früher im Flow (nicht fix). Content wurde nach oben in den Header-Bereich gezogen, um den freien Platz optisch zu nutzen.

**Fix:**
- Body-Klasse `body-fixed-chrome` (existiert bereits in sidebarHeader.css) am `<body>` von `summary.html` → macht den Mobile-Header `position: fixed; top: 0` und setzt `padding-top: 88px` auf den Body.
- Negative `margin-top: -100px` auf `.summary__container` entfernen (jetzt sitzt der Header fix darüber, Content darf nicht ins Header-Feld ragen).
- `.main__container` bekommt fixe Höhe `calc(100dvh - 88px - 96px)` und `overflow: hidden`, damit garantiert nicht gescrollt werden kann.
- Vertikale Content-Höhe leicht reduzieren (Header margin-bottom kleiner, Summary-Header height auto statt 90px, Section-Gaps) sodass es auf typischen Handy-Viewports (≥ 568px verfügbare Höhe) reinpasst.

### Ziel 2 — Contacts Detail @<421px

Aktuell in `contactsResponsive.css` @420px:
```css
.contact-name-main-container { width: 320px; gap: 32px; }
.contact-name-container { margin-right: -50px; }
.ellipse { height: 48px; width: 48px; font-size: 28px; margin-right: -28px; }
```

Der 32px-Gap zwischen Ellipse und Namens-Container ist bei nur 320px Container-Breite und 48px-Ellipse zu groß. User will „weniger Abstand".

**Fix:** Gap von 32px auf 12px reduzieren. `margin-right: -28px` auf `.ellipse` bleibt (verkleinert das Overall-Layout, ist ein bestehendes Design-Tuning).

## Änderungen

### `summary.html`

`class="body-fixed-chrome"` am `<body>`.

### `styles/summary.css` — Mobile-Blöcke aufräumen

- `@media (max-width: 800px)`:  
  `.main__container` → `height: calc(100dvh - 88px - 96px); margin-top: 0; margin-bottom: 0; overflow: hidden; align-items: center` (statt reines flex).  
  `.summary__container` → `margin-top: 0` (statt -100px).  
  `.summary__header { height: auto; margin-bottom: 24px }` (überschreibt die 80px aus @920px).  
  `.summary__tiles__container { gap: 16px }` (statt 28px).
- `@media (max-width: 450px)`:  
  `.main__container` → `height: calc(100dvh - 88px - 96px); margin-top: 0; margin-bottom: 0` (statt height 480px, margin-top 95px).
- `@media (max-width: 800px) and (min-height: 667px) and (max-height: 823px)`:  
  `.summary__container { margin-top: 0 }` (war -100px).

### `styles/contactsResponsive.css` @420px

`.contact-name-main-container { gap: 12px }` (statt 32px).

## Verifikation

- Summary auf Mobile-Viewport (z. B. 375x667): Mobile-Header bleibt oben beim (nicht mehr möglichen) Scroll, Content sitzt zwischen Header und Nav, kein sichtbares Overflow.
- Contacts Detail-View @<421px: Ellipse und Name sitzen enger beieinander (12px statt 32px sichtbarer Abstand).
