---
slug: fixed-nav-and-contacts-narrow-fixes
date: 2026-07-10
type: quick
status: complete
---

# Summary — Fixed Mobile-Header + Contacts Narrow-Width Fixes

## Changes

### 1. Content-only Scroll (Legal/Privacy/Help/Board)

**`styles/sidebarHeader.css`**
Innerhalb `@media (max-width: 800px)` neu:
```css
body.body-fixed-chrome { padding-top: 88px; }
body.body-fixed-chrome .mobile-header {
  position: fixed; top: 0; left: 0; right: 0;
  width: 100%; background-color: white;
  box-sizing: border-box; box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
  z-index: 100;
}
```
- Mobile-Nav (`.mobile-nav`) war bereits `position: fixed; bottom: 0`.  
- Body padding-top: 88px = 56px (Profil-Icon) + 32px (padding 1em top+bottom) — reserviert Platz für den fixen Header.  
- Desktop unverändert: `.desktop-header` und `.sidebar` sind schon `position: fixed`, Body scrollt.

**HTML**
`class="body-fixed-chrome"` an `<body>` angefügt:
- `legalNotice.html`
- `privacy.html`
- `help.html`
- `board.html`

Body-Klasse als Guard: verhindert Nebenwirkungen bei Contacts/Summary/Task, wo die Mobile-Layouts teilweise auf einen fließenden Mobile-Header aufsetzen (Contacts hat `top: 96px + calc(100dvh - 96px - 96px)`, Summary hat eigene Transforms).

### 2. Add-Contact-Button @1247px (Contacts)

**`styles/contactsResponsive.css`** — im `@media (max-width: 1250px)`-Block:  
Full-Width-Anpassung für den Add-Contact-FAB ergänzt (bisher nur ab @1140px aktiv):
```css
.add-contact-container { padding: 16px 20px; box-sizing: border-box; width: 100%; }
.add-contact { width: 100%; }
.add-button-text { font-size: 18px; white-space: nowrap; }
.person-add-png { margin-left: 12px; flex-shrink: 0; }
```
Damit passt der Button ab 1250px sauber in die 370px-Sidebar (statt 352 + 104px Padding = 456px total).

### 3. Contacts-Sektionsbuchstaben @≤1250px sichtbar

**`styles/contactsResponsive.css`** — im `@media (max-width: 1250px)`-Block:
```css
.contact-list { align-items: stretch; }
.contacts-first-letter-container {
  width: 100%;
  padding-left: 20px;
  box-sizing: border-box;
}
```

**Root cause:** `.contact-list` erbt aus der Basis `align-items: center`. Der Basis-`.contacts-first-letter-container` ist 352px breit mit `padding-left: 36px`. Wenn `.contacts-main-container` schmaler wird (370 → 260px), zentriert `align-items: center` den 352px-Container, dessen linke Kante rutscht in den negativen Bereich, `overflow-x: hidden` auf dem Main-Container klippt — der Buchstabe (bei 36px innerhalb des Letter-Containers) verschwindet auf der linken Seite.  
**Fix:** Container ab @1250px `width: 100%` + `align-items: stretch` auf `.contact-list` → Letter-Container erstreckt sich sauber über die Sidebar-Breite und der Buchstabe sitzt bei `padding-left: 20px` immer sichtbar am linken Rand.

## Verifikation

- **Legal/Privacy/Help/Board Mobile (≤800px):** Beim Scrollen bleibt Mobile-Header oben, Mobile-Nav unten, nur der Content dazwischen scrollt.
- **Legal/Privacy/Help/Board Desktop:** Header (fix) + Sidebar (fix) sichtbar, Body scrollt — unverändert.
- **Contacts @1247px:** Add-Contact-Button (jetzt 100%-breit im 20px-Padding-Container) ragt nicht mehr rechts aus der Sidebar heraus.
- **Contacts @1200/1000/900px:** Sektionsbuchstaben (A/B/C…) sitzen links sichtbar am Container-Rand (padding-left 20px), keine Clipping durch `overflow-x: hidden` mehr.

## Geänderte Dateien

- `styles/sidebarHeader.css`
- `styles/contactsResponsive.css`
- `legalNotice.html`, `privacy.html`, `help.html`, `board.html` (`class="body-fixed-chrome"` am `<body>`)
