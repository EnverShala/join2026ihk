---
slug: guest-logout-on-index-and-logo-links
date: 2026-07-09
type: quick
status: complete
---

# Summary — Guest-Logout auf index.html + Logo linkt auf index.html

## Changes

### `js/firebaseDatabaseFunctions.js`

`indexHtmlInit()` erweitert:
- `sessionStorage.removeItem("guestLoggedIn")` bei jedem Landing → Guest muss sich neu einloggen.
- Wenn `localStorage.loggedInAccount` gesetzt → redirect zu `summary.html`.
- Sonst → redirect zu `login.html`.

### Logo-Links: `summary.html` → `index.html`

16 Vorkommen von `<a href="summary.html">` um das Logo-`<img>` in 9 HTML-Dateien ersetzt:
- `board.html`, `contacts.html`, `help.html`, `legalNotice.html`, `privacy.html`, `summary.html`, `task.html` — Desktop-Sidebar-Logo + Mobile-Header-Logo (je 2).
- `sidebar-header.html` — Template mit beiden.
- `sidebar-desktop.html` — nur Desktop-Logo (1).

Andere `href="summary.html"` (Nav-Links „Summary" etc.) bleiben unberührt.

## Verification

- Als Guest einloggen → auf Board → Logo klicken → landet via index.html → Login-Seite (Guest wurde gecleart).
- Als echter User einloggen → Logo klicken → landet via index.html → Summary.
- Direkter Aufruf `index.html` mit aktivem Guest-Flag → Guest wird gecleart → Login.
- Bestehende Nav-Link „Summary" öffnet weiterhin `summary.html` direkt (unverändert).
