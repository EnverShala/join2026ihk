---
slug: contacts-mobile-header-help-icon-sidebar-active
date: 2026-07-09
type: quick
---

# Contacts Mobile-Header + Help-Icon entfernen + Sidebar-Footer full-width Active

## Probleme

### 1. Contacts Mobile ≤800px: „Contacts | Better with a team"-Header fehlt

Auf Desktop steht rechts oben in der Contacts-Ansicht der Section-Header „Contacts | Better with a team" mit blauem Vertical-Divider. Auf Mobile ≤800px ist er via `.display-contact-header { display: none }` (`contactsResponsive.css:304-307`) versteckt. User will diesen Header über der Kontaktliste stehen sehen.

Zusätzlich setzt `js/firebaseUserRendering.js` in `applyContactsLayoutForWidth` bzw. `showContactListAgainInResponsiveMode` beim List-View auf Mobile explizit `header.style.display = "none"` — muss auch auf `"flex"` geändert werden, damit der Header über der Liste erscheint.

### 2. „?"-Help-Icon in der Navbar entfernen

Jede Seite hat in `.desktop-header > .header-icons` ein `<a href="./help.html"><img src="img/contacts/help.png" ...>`. User will das entfernt haben. Der „Help"-Eintrag im Profil-Sub-Menu (das Popover) bleibt bestehen.

### 3. Sidebar-Footer Active-State soll gesamte Sidebar-Breite füllen (und auch bei Login greifen)

`.nav-links-footer` sitzt fixed bei `left: 3.5rem`, die Active-Klasse malt nur `padding: 6px 12px` Hintergrund um den Text — sieht wie ein Pill aus. User will einen Hintergrund, der die ganze Sidebar-Breite (232px) einnimmt, ähnlich wie `.nav-links:hover`.

Zusätzlich wird `.active` derzeit nur von `hideNavIfNotLoggedIn()` gesetzt, und die Funktion returned früh, wenn eingeloggt. Also sieht ein eingeloggter User auf Privacy/Legal keinen Active-State. User will identisches Verhalten (also eingeloggt und ausgeloggt).

## Fix

### `styles/contactsResponsive.css` @800px

- Existierende `.display-contact-header, .display-contact { display: none }` in getrennte Regel splitten (nur `.display-contact` behält `display: none` als Ausgangszustand; JS toggled).
- Neue Regeln für `.display-contact-header` auf Mobile:
  - `position: static` (statt fixed).
  - `order: -1` (positioniert oberhalb `.contact-list` im flex-column `.contacts-main-container`).
  - `width: 100%`, `max-width: 100%`, `top/left: unset`, `padding: 4px 8px 12px`, `gap: 16px`.
  - `.h1Contacts` kleiner (`font-size: 32px`).
  - `.span-txt` kleiner (`font-size: 16px`).
  - `.border-vertical` proportional kleiner.

### `js/firebaseUserRendering.js`

- `applyContactsLayoutForWidth`: Mobile no-selection branch — `header.style.display = "flex"` statt `"none"`.
- `showContactListAgainInResponsiveMode`: `header.style.display = "flex"` statt `"none"`.
- Kein Behavior-Change für Desktop-Branch und Detail-Selection-Branch.

### 9 HTML-Dateien: `<a href="./help.html"><img src="img/contacts/help.png" ...>` entfernen

Betroffen: `board.html`, `contacts.html`, `help.html`, `legalNotice.html`, `privacy.html`, `sidebar-desktop.html`, `sidebar-header.html`, `summary.html`, `task.html`.

Nur das Icon-Anchor entfernen — der „Help"-Eintrag im `sub-menu-modal-*` bleibt.

### `styles/sidebarHeader.css`

- `.nav-links-footer`: `left: 3.5rem → 0`, neue `width: 232px`, `gap: 20px → 4px`, `padding: 0`, `margin: 0`, `box-sizing: border-box`.
- Neue Regel `.nav-links-footer li { list-style: none }` (aufräumen).
- Neue Regel `.nav-links-footer a { display: block; padding: 8px 3.5rem; color: #a8a8a8 }` — Block-Element, Text sitzt via padding an der alten Position.
- `.nav-links-footer a:hover`: `transform: scale(1.2)` entfernen (passt nicht mehr zu Block-Anchor), stattdessen leichter Hover-Bg (`background-color: rgba(9,26,49,.5)`).
- `.nav-links-footer a.active`: `padding` und `border-radius` weg — Background greift jetzt full-width dank Block-Anchor.
- `@media (max-height: 700px) and (min-width: 801px)`: `left: 1rem → 0`, `padding: 4px 12px` auf Anchors (row-Layout kompakt halten).

### `js/firebaseDatabaseFunctions.js`

- In `hideNavIfNotLoggedIn`: Active-Marking-Block VOR den `if (isLoggedIn) return`-Guard verschieben, sodass auch eingeloggte User auf Privacy/Legal/Help den Active-State im Sidebar-Footer sehen.

## Verification

- Contacts @375px / @800px: „Contacts | Better with a team"-Header sitzt oberhalb der Liste, danach FAB unten. Klick auf Kontakt öffnet Detail-View wie bisher.
- Beliebige Seite Desktop: kein Fragezeichen-Icon mehr rechts oben in der Navbar; „G"-Profil bleibt.
- Privacy/Legal-Seite (eingeloggt und ausgeloggt): Sidebar-Footer-Link zur aktuellen Seite hat einen dunklen Balken über die volle Sidebar-Breite (232px).
