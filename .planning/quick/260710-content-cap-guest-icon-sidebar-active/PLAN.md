---
slug: content-cap-guest-icon-sidebar-active
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Content-Cap 1420px + Guest-Profil-Icon + Sidebar-Login-Only + Main-Link Active

## Ziel

Vier zusammenhängende UI-Fixes:

1. Legal Notice, Privacy Policy und Help: Content bis maximal 1420px Bildschirmbreite (bzw. max-width so, dass die Textspalte auf 1420px passt) — sonst zieht sich der Text auf großen Bildschirmen unangenehm breit.
2. Profilicon in der Navbar soll **auch für Guest-User** sichtbar sein (bisher: nur echte User).
3. Wenn weder Guest noch User eingeloggt ist und man von der Login-/Signup-Seite auf Privacy/Legal klickt, sollen in der Sidebar links **nur der Login-Link** und nicht Summary/Add Task/Board/Contacts angezeigt werden.
4. Wenn man auf `board.html`, `summary.html`, `task.html` (Add Task) oder `contacts.html` ist, soll der entsprechende Sidebar-Link markiert werden — identische Optik wie der Footer-Active-State auf Privacy/Legal.

## Analyse

**Punkt 1 — Content-Cap**  
`.textContentPrivacy/.textContentLegalNotice/.textContentHelp` haben aktuell `margin: 50px 50px 100px 282px` in `styles/sidebarHeader.css` (Zeile ~250). Kein `max-width`. Auf Bildschirmen >1420px zieht sich der Text.  
→ `max-width: 1088px` (= 1420 − 232px Sidebar − 50px linker Gap − 50px rechter Gap) auf die drei Container.

**Punkt 2 — Guest-Profilicon**  
`loadAccountInitials()` in `js/firebaseDatabaseFunctions.js` (Zeile 365) prüft nur `localStorage.loggedInAccount` und returned früh für Guests. Guest-Session ist `sessionStorage.getItem("guestLoggedIn") === "true"`. Für Guests soll "G" angezeigt werden.

**Punkt 3 — Sidebar-Login-Only auf Privacy/Legal**  
Ist bereits in `hideNavIfNotLoggedIn()` implementiert (siehe `260709-guest-sidebar-login-link`). Verifizieren, dass es weiterhin funktioniert nach Punkt 2 (bei Guests soll die Sidebar-Umstrukturierung NICHT laufen — das ist der jetzige Zustand und bleibt).

**Punkt 4 — Active-State für Main-Sidebar**  
Aktuell markiert `hideNavIfNotLoggedIn()` nur `.nav-links-footer a` (Privacy/Legal-Link im Footer). Für die Haupt-Nav (`.menu-sidebar .nav-links`) fehlt die Markierung.  
→ Neue Funktion (oder Erweiterung von `hideNavIfNotLoggedIn`) markiert auch `.menu-sidebar .nav-links` bei URL-Match.  
→ CSS für `.nav-links.active` (dunkler Hintergrund `#091a31`, wie bereits im Hover-State).

## Änderungen

### `styles/sidebarHeader.css`

- `.textContentPrivacy, .textContentLegalNotice, .textContentHelp` → `max-width: 1088px` (Content-Cap auf 1420px-Layoutbreite).
- Neue Regel `.menu-sidebar .nav-links.active` → `background-color: #091a31; color: white`.
- Sicherstellen, dass icon in aktivem Link auch `filter: invert` bzw. `fill: white` bekommt (bereits Hover-Regel `.iconsSVG:hover path { fill: white }` vorhanden — Icons sind aber via `<img src="...svg">` gebunden, nicht inline. Beim aktiven Link daher `background` + `color` reichen; SVG-Icons können nicht per CSS ge-fill't werden).

### `js/firebaseDatabaseFunctions.js`

- `loadAccountInitials()`:
  - `isLoggedIn = realUser || guestLoggedIn === "true"` statt nur real-user-Check.
  - Wenn nur Guest: `initials = "G"`.
  - Sonst wie bisher.
- `hideNavIfNotLoggedIn()`: Active-Marking-Block erweitern, sodass auch `.menu-sidebar .nav-links` mit passendem `href` `.active` bekommt. Bleibt vor dem `if (isLoggedIn) return`-Guard, damit auch eingeloggte User den State sehen.
- Sicherstellen, dass diese Funktion nicht nur auf Privacy/Legal/Help läuft, sondern auch auf `board.html`, `summary.html`, `task.html`, `contacts.html` — sonst gibt es kein Active-Marking auf den Hauptseiten.  
  → Option A: Funktion in allen HTML-`onload`-Attributen aufrufen. Option B: neue kleinere Funktion `markActiveSidebarLinks()` extrahieren und überall aufrufen (sauberer, aber mehr Änderung).  
  → Nehme Option A (minimale Änderung, weniger Files).

### HTML — `onload` erweitern

- `summary.html`, `task.html`, `board.html`, `contacts.html`: `onload="... loadAccountInitials(); hideNavIfNotLoggedIn()"` (Guest-Branch der Funktion returned früh, also kein Sidebar-Restructure — nur das Active-Marking läuft).

## Verifikation

- Legal/Privacy/Help auf 1920px-Screen: Text bricht nach ~1088px.
- Guest-Login: G-Icon im Header sichtbar auf Summary/Board/etc.
- Auf Login-Seite → Privacy-Link → Sidebar zeigt nur Login-Link, kein Guest-Sidebar-Restructure.
- Board-Seite (eingeloggt): Board-Link in Sidebar dunkel hinterlegt.
