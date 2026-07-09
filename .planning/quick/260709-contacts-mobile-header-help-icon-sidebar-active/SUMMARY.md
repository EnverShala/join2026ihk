---
slug: contacts-mobile-header-help-icon-sidebar-active
date: 2026-07-09
type: quick
status: complete
---

# Summary — Contacts Mobile-Header + Help-Icon entfernen + Sidebar-Footer full-width Active

## Changes

### 1. Contacts Mobile ≤800px: „Contacts | Better with a team" über der Liste

**`styles/contactsResponsive.css` @800px**
- `.display-contact-header, .display-contact { display: none }`-Regel gesplittet: nur `.display-contact` behält den `display: none`-Ausgangszustand.
- Neuer Block für `.display-contact-header` auf Mobile: `display: flex; position: static; order: -1; width: 100%; padding: 4px 8px 12px; gap: 16px`. `order: -1` sorgt dafür, dass der Header in `.contacts-main-container` (flex-column) oberhalb der Liste erscheint.
- `.display-contact-header .h1Contacts { font-size: 32px }`, `.span-txt { font-size: 16px }`, `.border-vertical { height: 28px; border-width: 2px }` — mobile-freundliche Skalierung des blauen Trennstrichs + „Better with a team"-Textes.

**`js/firebaseUserRendering.js`**
- `applyContactsLayoutForWidth` Mobile-No-Selection-Branch: `header.style.display = "none" → "flex"`.
- `showContactListAgainInResponsiveMode`: `header.style.display = "none" → "flex"` beim Zurück-Wechsel zur Liste.

### 2. „?"-Help-Icon in der Navbar entfernt

`<a href="./help.html"><img src="img/contacts/help.png" ...></a>` aus `.desktop-header > .header-icons` in 9 Dateien entfernt: `board.html`, `contacts.html`, `help.html`, `legalNotice.html`, `privacy.html`, `sidebar-desktop.html`, `sidebar-header.html`, `summary.html`, `task.html`. Der „Help"-Eintrag im Profil-Sub-Menu (Popover) bleibt bestehen.

### 3. Sidebar-Footer full-width Active-State, auch bei Login

**`styles/sidebarHeader.css`**
- `.nav-links-footer`: `left: 3.5rem → 0`, `width: 232px` (Sidebar-Breite), `gap: 20px → 4px`, `padding: 0`, `margin: 0`, `box-sizing: border-box`.
- Neue `.nav-links-footer li`: `list-style: none; width: 100%; margin: 0; padding: 0`.
- Neue `.nav-links-footer a`: `display: block; padding: 8px 3.5rem; color: #a8a8a8; text-decoration: none` — Text sitzt via padding an der alten Position, aber der Block-Anchor erstreckt sich über die volle Sidebar-Breite.
- `.nav-links-footer a:hover`: `transform: scale(1.2)` → subtiler Hover-Bg `rgba(9,26,49,.5)` (passt zu Block-Layout).
- `.nav-links-footer a.active`: `padding` + `border-radius` weg → dunkler Hintergrund `#091a31` greift jetzt full-width.
- `@media (max-height: 700px) and (min-width: 801px)`: `left: 1rem → 0`, `width: 232px`, `justify-content: center`, Anchors `padding: 4px 8px` (kompakt für Row-Layout).

**`js/firebaseDatabaseFunctions.js`**
- Active-Marking-Block in `hideNavIfNotLoggedIn()` VOR den `if (isLoggedIn) return`-Guard verschoben (identischer Code, nur Position). Doppel-Definition am Funktionsende entfernt. Jetzt sehen auch eingeloggte User auf Privacy/Legal/Help den Active-State im Sidebar-Footer.

## Verification (visuell)

- Contacts @375px / @800px: „Contacts | Better with a team"-Header sitzt bündig über der Liste. Klick auf Kontakt öffnet Detail-View wie bisher. Zurück-Button zeigt wieder Liste mit Header.
- Beliebige Seite Desktop: kein Fragezeichen mehr rechts oben; „G"-Profil bleibt.
- Privacy/Legal (eingeloggt und ausgeloggt): Sidebar-Footer-Link zur aktuellen Seite hat dunklen Balken über die volle Sidebar-Breite (232px).
