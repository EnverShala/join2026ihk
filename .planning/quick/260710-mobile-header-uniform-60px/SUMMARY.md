---
slug: mobile-header-uniform-60px
date: 2026-07-10
type: quick
status: complete
---

# Summary — Mobile-Header einheitlich 60px

## Changes

### `styles/sidebarHeader.css` — `@media (max-width: 800px)`

`.mobile-header` bekommt jetzt global:
```css
height: 60px;
box-sizing: border-box;
```
- `height: 60px` matcht den bereits auf `summary.html` (summary.css) und `board.html`/`task.html` (addTaskResponsive.css) vorhandenen Wert — jetzt gilt er auch auf `contacts.html`, `legalNotice.html`, `privacy.html`, `help.html`.
- `box-sizing: border-box` sorgt für gleiches Rendering unabhängig davon, ob eine Seite `* { box-sizing: border-box }` aus addContacts.css/editContacts.css importiert oder nicht.

`body.body-fixed-chrome { padding-top: 60px }` (war 88px) — passt zur neuen Header-Höhe. Ohne diesen Abzug bliebe 28px Leerraum zwischen fixem Header und Content.

### `styles/summary.css`

`.main__container { height: calc(100dvh - 60px - 96px) }` (war -88px) in beiden Media-Queries (@800px und @450px). Content füllt jetzt exakt den Raum zwischen 60px-Header und 96px-Bottom-Nav.

## Verifikation

- Contacts/Legal/Privacy/Help Mobile: Mobile-Header ist gleich dünn wie auf Summary/Board/Task (60px total).
- Legal/Privacy/Help/Board/Summary (body-fixed-chrome): Content sitzt direkt unter dem fixen Header, kein Leerraum.

## Geänderte Dateien

- `styles/sidebarHeader.css`
- `styles/summary.css`
