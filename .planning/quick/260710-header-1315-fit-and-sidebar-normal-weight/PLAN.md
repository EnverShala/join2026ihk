---
slug: header-1315-fit-and-sidebar-normal-weight
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Header @1315 Fit + Sidebar font-weight normal

## Ziele

1. Zwischen 1251px und 1315px (viewport) wird der display-contact-header („Contacts | Better with a team") vom rechten Bildschirmrand abgeschnitten.
2. Sidebar-Haupt-Links (Summary/Add Task/Board/Contacts) sollen definitiv nicht bold gerendert werden — explizit auf `font-weight: 400` fixieren.

## Analyse

### 1. Header-Overflow zwischen 1251-1315

- Basis `.display-contact-header { left: 743px; width: 569px }`.
- `@media (max-width: 1315px)`: `width: 520px`, aber `left` unverändert bei 743px.
- Bei viewport 1251: 743 + 520 = 1263 → 12px übers rechte Fenster.
- Bei viewport 1300: 743 + 520 = 1263 → nur 37px Margin, span-txt bekommt kaum Luft, effektiv Cliping am Rand.
- `.display-contact` selbe Positionierung (`left: 750` base) — braucht analoge Korrektur.

Fix: im `@media (max-width: 1315px)`-Block `left` und `width` reduzieren, damit Header + Detail-Body sicher in 1251-Range passen, plus kleinere Font-Sizes (h1Contacts 54, span-txt 24 — Werte identisch zu @1250 wären konservativ).

Zielmaße:
- `.display-contact-header { left: 720px; width: 480px; gap: 20px }`
- `.display-contact { left: 720px }`
- `.h1Contacts { font-size: 54px }`
- `.span-txt { font-size: 24px }`

Damit bei viewport 1251: header 720+480=1200, 51px Margin. Bei 1315: 115px Margin.

### 2. Sidebar font-weight normal

- Nirgends in `sidebarHeader.css` ist ein explizites `font-weight` auf `.menu-sidebar .nav-links` gesetzt.
- Um jegliches unbeabsichtigtes bold auszuschließen: explizit `font-weight: 400` auf `.menu-sidebar .nav-links` und `.menu-sidebar .nav-links li`, inkl. für den `.active`-State.

## Änderungen

### `styles/contactsResponsive.css` `@media (max-width: 1315px)`
```css
.display-contact-header {
  width: 480px;
  left: 720px;
  height: 73px;
  gap: 20px;
}
.display-contact {
  left: 720px;
}
.h1Contacts {
  font-size: 54px;
}
.span-txt {
  font-size: 24px;
}
```

### `styles/sidebarHeader.css`

Neu vor/neben dem `.menu-sidebar .nav-links.active`-Block:
```css
.menu-sidebar .nav-links,
.menu-sidebar .nav-links li,
.menu-sidebar .nav-links.active,
.menu-sidebar .nav-links.active li {
  font-weight: 400;
}
```

## Verifikation

- Viewport 1260/1300: „Better with a team" komplett sichtbar am rechten Rand.
- Sidebar-Links: alle vier in normaler Roboto-400-Strichstärke, aktiver Link nur durch dunklen Balken + weißen Text hervorgehoben, nicht durch Bold.
