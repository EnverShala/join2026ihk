---
slug: mobile-header-uniform-60px
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Mobile-Header einheitlich 60px

## Ziel

Alle mobilen Seiten sollen den gleichen dünnen Mobile-Header (60px hoch) haben — bisher nur `summary.html` (via summary.css) und `board.html`/`task.html` (via addTaskResponsive.css). Contacts, Legal Notice, Privacy Policy und Help zeigen den dickeren Default-Header (~88px, content-basiert).

## Analyse

- `summary.css` @1024px: `.mobile-header { height: 60px }`.
- `addTaskResponsive.css` @800px: `.mobile-header { height: 60px }`.
- `sidebarHeader.css` @800px: `.mobile-header { display: flex; padding: 1em; z-index: 100 }` — kein height. Padding 16px + Content (Profil-Icon 56px) = ~88px Default.
- Kontakts hat `* { box-sizing: border-box }` (aus addContacts.css/editContacts.css) → würde `height: 60px` als border-box interpretieren.
- Auf anderen Seiten (Legal/Privacy/Help/Summary/Task/Board) kein globales `box-sizing: border-box`.

Damit `height: 60px` überall gleich rendert, muss `.mobile-header` explizit `box-sizing: border-box` bekommen.

Ausserdem: `body.body-fixed-chrome { padding-top: 88px }` aus vorigem Task — muss jetzt auf 60px (Höhe des fixen Headers), sonst entsteht 28px Leerraum unterhalb des Fixed-Headers.  
`summary.css` `.main__container { height: calc(100dvh - 88px - 96px) }` in @800 und @450 → analog auf 60 anpassen.

## Änderungen

### `styles/sidebarHeader.css` (@media max-width: 800px)
```css
.mobile-header {
  display: flex;
  padding: 1em;
  height: 60px;
  box-sizing: border-box;
  z-index: 100;
}
body.body-fixed-chrome {
  padding-top: 60px;  /* war 88 */
}
```

### `styles/summary.css`
- `@media (max-width: 800px)` `.main__container { height: calc(100dvh - 60px - 96px) }` (war -88px).
- `@media (max-width: 450px)` `.main__container { height: calc(100dvh - 60px - 96px) }` (war -88px).

### Cleanup (optional, aber sauber)
- `summary.css` @1024 `.mobile-header { height: 60px }` → kann bleiben (identisch zu globaler Regel, keine Konflikte).
- `addTaskResponsive.css` @800 `.mobile-header { height: 60px }` → kann bleiben (redundant, aber harmlos).

## Verifikation

- Contacts/Legal/Privacy/Help mobile: Header ist deutlich dünner, matcht Summary/Board/Task.
- body-fixed-chrome-Seiten (Legal/Privacy/Help/Board/Summary): Content sitzt direkt unter dem fixierten 60px-Header ohne 28px Leerraum.
