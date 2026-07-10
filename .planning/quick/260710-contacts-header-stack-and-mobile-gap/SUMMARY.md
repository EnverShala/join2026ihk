---
slug: contacts-header-stack-and-mobile-gap
date: 2026-07-10
type: quick
status: complete
---

# Summary — Contacts Header @801-950 stack + Mobile-Leerraum weg

## Changes

### 1. Header vertikal gestapelt @801-950

**`styles/contactsResponsive.css`** — neuer Block:
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

- Nur im 801-950-Range aktiv, damit das @800-Mobile-Layout (order: -1, static, row) unberührt bleibt.
- `.border-vertical` wird von vertikal (height 59, width 0) zu horizontal (height 0, width 90, border-top 2px) — die blaue Trennlinie erscheint jetzt **unter** „Contacts", darunter dann „Better with a team".

### 2. Leerraum unter Mobile-Header auf Contacts

**`styles/contactsResponsive.css`** — `@media (max-width: 800px)` `.contacts-main-container`:
- `top: 60px` (neu; Base war 96px vom Desktop-Header — Mobile-Header ist jetzt 60px hoch).
- `height: calc(100dvh - 60px - 96px)` (war `calc(100dvh - 96px - 96px)`).

Damit sitzt der Contacts-Content direkt unter dem 60px-Mobile-Header, kein 36px-Gap mehr.

## Verifikation

- Viewport 900: „Contacts" oben, kurze horizontale Blaulinie darunter, „Better with a team" darunter — sauber gestapelt in schmaler Spalte.
- Viewport 380: Kontaktliste beginnt unmittelbar unterhalb des Mobile-Headers, keine graue Lücke mehr.

## Geänderte Dateien

- `styles/contactsResponsive.css`
