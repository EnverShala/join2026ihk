---
slug: guest-logout-on-index-and-logo-links
date: 2026-07-09
type: quick
---

# Guest-Logout auf `index.html` + Logo linkt auf `index.html`

## Problem

1. **Guest bleibt dauerhaft eingeloggt.** Der Guest-Session-Flag `sessionStorage.guestLoggedIn` bleibt bis die Browser-Session endet (Tab-close), sodass ein Guest sich beim erneuten Besuch nicht neu „einloggen" muss.
   
   User will: Bei jedem Aufruf von `index.html` wird `guestLoggedIn` gecleart, damit der Guest immer wieder aktiv „Guest Log in" klicken muss.

2. **Join-Logo linkt aktuell auf `summary.html`.** Damit landet ein ausgeloggter/nicht angemeldeter Nutzer trotzdem auf der Summary-Seite (die dann wahrscheinlich Fehler wirft oder ihn zu Login redirected). Zusätzlich umgeht der Guest den erwünschten „re-login" beim Logo-Klick.
   
   User will: Logo linkt auf `index.html`. Der `indexHtmlInit()`-Router entscheidet dann:
   - Guest oder nicht eingeloggt → `login.html`
   - Echter User (localStorage.loggedInAccount) → `summary.html`

## Fix

### `js/firebaseDatabaseFunctions.js`

`indexHtmlInit()` erweitern:
```js
function indexHtmlInit() {
  sessionStorage.removeItem("guestLoggedIn");
  const loggedInAccount = localStorage.getItem("loggedInAccount");
  if (loggedInAccount && loggedInAccount !== "") {
    window.location.href = "summary.html";
  } else {
    window.location.href = "login.html";
  }
}
```

Bewirkt: Jeder Aufruf von `index.html`
- clearet den Guest-Flag,
- routet echte User zu Summary,
- schickt alle anderen (inkl. gerade ausgeloggter Guest) zurück zum Login.

### Logo-Links in allen Seiten

`<a href="summary.html"><img class="logo-join-white" ...>` → `<a href="index.html"><img class="logo-join-white" ...>`
`<a href="summary.html"><img class="logo-join-mobile" ...>` → `<a href="index.html"><img class="logo-join-mobile" ...>`

Betroffene Dateien: `board.html`, `contacts.html`, `help.html`, `legalNotice.html`, `privacy.html`, `summary.html`, `task.html`, `sidebar-desktop.html`, `sidebar-header.html` (9 Dateien, 16 Vorkommen).

## Verification

- Als Guest einloggen → auf Board → Logo klicken → landet auf Login-Seite (nicht mehr Summary).
- Als echter User einloggen → auf Board → Logo klicken → landet auf Summary.
- Nach Guest-Login → Tab offen halten → `index.html` direkt in Adressleiste → landet auf Login.
- Andere `href="summary.html"` (Nav-Links „Summary" etc.) bleiben unverändert, sind vom Fix ausgenommen.
