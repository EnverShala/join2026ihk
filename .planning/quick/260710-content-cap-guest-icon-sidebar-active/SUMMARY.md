---
slug: content-cap-guest-icon-sidebar-active
date: 2026-07-10
type: quick
status: complete
---

# Summary — Content-Cap + Guest-Profil-Icon + Sidebar-Login-Only + Main-Link Active

## Changes

### 1. Legal Notice / Privacy Policy / Help — Content-Cap 1420px

**`styles/sidebarHeader.css`**
- `.textContentPrivacy, .textContentLegalNotice, .textContentHelp` erweitert um `max-width: 1088px`.  
  Rechnung: 1420px Layoutbreite − 232px Sidebar − 50px linker Gap − 50px rechter Gap = 1088px. Bei Screens ≥1420px zieht sich der Text jetzt nicht mehr über die volle Restbreite; der 282px-Left-Margin und der 50px-Right-Margin bleiben.

### 2. Profilicon in der Navbar auch für Guests

**`js/firebaseDatabaseFunctions.js` — `loadAccountInitials()`**
- Zusätzliche Prüfung `sessionStorage.getItem("guestLoggedIn") === "true"`.  
- Guest-Fall: Initialen werden hart auf `"G"` gesetzt.  
- Real-User: unverändert.  
- Kein Icon: nur wenn weder Guest noch User eingeloggt (unverändert).

### 3. Sidebar bei Login/Signup → Privacy/Legal zeigt nur Login-Link

Kein neuer Code — das bestehende `hideNavIfNotLoggedIn()` deckt diesen Fall bereits ab (aus dem vorherigen Quick-Task `260709-guest-sidebar-login-link`). Verifiziert:
- Auf `privacy.html`, `legalNotice.html`, `help.html` läuft `hideNavIfNotLoggedIn()` via `onload`.
- Weder Real-User noch Guest → `.menu-sidebar` wird entfernt, `.login-sidebar-link` injiziert, Header-Icons + Mobile-Nav ausgeblendet, `body.guest-view` gesetzt.

### 4. Active-State für Main-Sidebar-Links (Summary/Add Task/Board/Contacts)

**`js/firebaseDatabaseFunctions.js` — `hideNavIfNotLoggedIn()`**
- Active-Marking in eine kleine Helper-Funktion `markActive(selector)` refactored.  
- Beide Selektoren markiert: `.nav-links-footer a` (wie bisher) UND neu `.menu-sidebar .nav-links`. Läuft VOR dem `if (isLoggedIn) return`, also auch für eingeloggte User.

**`styles/sidebarHeader.css`**
- Neue Regel `.menu-sidebar .nav-links.active { background-color: #091a31; color: white; }` (identische Farbe wie Footer-Active + wie der `.nav-links:hover`-Zustand).
- `.menu-sidebar .nav-links.active li { color: white; }` — damit der `<li>`-Text im aktiven Link weiß erscheint (die `<li>` erben `color` sonst vom `<a>`, aber sicherheitshalber explizit).

**HTML `onload` erweitert**
- `summary.html`, `task.html`, `board.html`, `contacts.html`: `onload="... loadAccountInitials(); hideNavIfNotLoggedIn()"` (bisher wurde `hideNavIfNotLoggedIn` nur auf Privacy/Legal/Help ausgeführt).  
- Für eingeloggte User returned die Funktion nach dem Active-Marking früh — es passiert kein Sidebar-Restructure. Für nicht-eingeloggte User (Direkt-Aufruf via URL ohne Login) restrukturiert sich die Sidebar zu Login-Only — sinnvolles Fallback-Verhalten.

## Verifikation (visuell)

- Legal/Privacy/Help auf 1920px-Screen: Textspalte cappt bei 1088px; keine übermäßige Streckung mehr.
- Guest-Login → Summary: „G"-Profilicon oben rechts sichtbar (vorher versteckt).
- Login-Seite → Privacy: Sidebar zeigt nur Login-Link, Footer markiert Privacy als active.
- Board/Summary/Task/Contacts (eingeloggt): jeweiliger Sidebar-Link dunkel hinterlegt (`#091a31`), Text weiß.

## Geänderte Dateien

- `styles/sidebarHeader.css` (2 Änderungen: max-width; menu-sidebar active state)
- `js/firebaseDatabaseFunctions.js` (2 Funktionen: `loadAccountInitials`, `hideNavIfNotLoggedIn`)
- `summary.html`, `task.html`, `board.html`, `contacts.html` (onload erweitert)
