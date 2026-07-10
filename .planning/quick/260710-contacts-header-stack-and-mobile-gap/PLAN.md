---
slug: contacts-header-stack-and-mobile-gap
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Contacts Header @801-950 stack + Mobile-Contacts Leerraum weg

## Ziele

1. Im Viewport-Bereich 801-950px soll der Contacts-Header vertikal gestapelt sein: „Contacts" oben, horizontale blaue Trennlinie darunter, „Better with a team" unten.
2. Auf mobiler Contacts-Seite (≤800px) sitzt aktuell ein 36px-Leerraum zwischen unterem Rand des Mobile-Headers (60px) und dem Beginn der Kontaktliste. Grund: `.contacts-main-container` hat `top: 96px` (base) und der Mobile-Header ist nach der letzten Änderung nur noch 60px hoch. Container an neuer Header-Höhe ausrichten.

## Analyse

### 1. Stacked Header @801-950

Aktueller `@media (max-width: 950px)`-Block:
- `.display-contact-header { max-width: 340px; gap: 16px }`
- `.h1Contacts { font-size: 36px }`, `.span-txt { font-size: 18px }`
- Layout ist Flex-Row (Contacts | Line | Text).

Für 801-950 spezifisch stapeln:
- `flex-direction: column; align-items: flex-start; gap: 8px; height: auto; max-width: 220px`
- `.border-vertical` transformieren: aus vertikaler 2px-Linie (height 59, width 0) zur horizontalen Linie (height 0, width 90, border-top 2px solid #29abe2).

Da @800 die `.display-contact-header` mit `flex-direction`-Reset (implizit auf row) und `order: -1` fürs Mobile-Flow-Layout überschreibt, muss die Stack-Regel spezifisch auf `min-width: 801px and max-width: 950px` gelten.

### 2. Mobile Leerraum

`contacts.css` Base:
```css
.contacts-main-container { position: fixed; top: 96px; ... }
```

@800-Override:
```css
.contacts-main-container {
  width: 100%;
  ...
  left: 0;
  z-index: 1;
  height: calc(100dvh - 96px - 96px);
  ...
}
```

`top` wird nicht überschrieben → bleibt 96px, aber Mobile-Header ist nur 60px. Ergibt 36px Gap.

Fix: `top: 60px; height: calc(100dvh - 60px - 96px)` in @800.

## Änderungen

### `styles/contactsResponsive.css`

Nach dem @950-Block:
```css
@media (min-width: 801px) and (max-width: 950px) {
  .display-contact-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    height: auto;
    max-width: 220px;
  }
  .display-contact-header .border-vertical {
    width: 90px;
    height: 0;
    border: none;
    border-top: 2px solid #29abe2;
  }
}
```

Innerhalb `@media (max-width: 800px)` `.contacts-main-container`:
```css
top: 60px;
height: calc(100dvh - 60px - 96px);
```

## Verifikation

- Viewport 900: Contacts-Detail-Header zeigt „Contacts" oben, kurze horizontale Blaulinie darunter, „Better with a team" unten — vertikal gestapelt.
- Viewport 380: Contacts-Content beginnt direkt unter dem 60px-Header, keine 36px-Lücke mehr.
