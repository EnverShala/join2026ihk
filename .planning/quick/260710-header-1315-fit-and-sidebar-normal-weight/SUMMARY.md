---
slug: header-1315-fit-and-sidebar-normal-weight
date: 2026-07-10
type: quick
status: complete
---

# Summary — Header @1315 Fit + Sidebar font-weight normal

## Changes

### 1. Header „Contacts | Better with a team" @1251-1315 sichtbar

**`styles/contactsResponsive.css`** — `@media (max-width: 1315px)`:
```css
.display-contact-header {
  width: 480px;        /* war 520 */
  left: 720px;         /* war base 743 → beseitigt Overflow bei viewport 1251-1300 */
  height: 73px;
  gap: 20px;           /* war base 30 → mehr Platz für den Text-Content */
}
.display-contact {
  left: 720px;         /* selber Shift wie Header, damit Detail-Body ausgerichtet bleibt */
}
.h1Contacts {
  font-size: 54px;     /* war base 61px */
}
.span-txt {
  font-size: 24px;     /* war 27px */
}
```

Bei viewport 1251: Header sitzt bei 720px, ist 480px breit → endet bei 1200px, 51px Rand-Margin. „Better with a team" ist nicht mehr am rechten Rand abgeschnitten.

### 2. Sidebar-Haupt-Links garantiert nicht bold

**`styles/sidebarHeader.css`** — neu vor `.menu-sidebar .nav-links.active`:
```css
.menu-sidebar .nav-links,
.menu-sidebar .nav-links li,
.menu-sidebar .nav-links.active,
.menu-sidebar .nav-links.active li {
  font-weight: 400;
}
```

Explizite Absicherung, dass Summary/Add Task/Board/Contacts in normaler Roboto-400-Strichstärke gerendert werden — inklusive im `.active`-Zustand (dunkler Balken + weißer Text, aber kein Bold).

## Verifikation

- Viewport 1260/1300: Header-Text komplett sichtbar, kein Clipping am rechten Rand.
- Sidebar: alle 4 Haupt-Links in gleicher normaler Strichstärke; aktiver Link nur durch Farbe/Hintergrund hervorgehoben.

## Geänderte Dateien

- `styles/contactsResponsive.css`
- `styles/sidebarHeader.css`
