---
slug: fixed-nav-and-contacts-narrow-fixes
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Fixed Mobile-Header + Contacts Narrow-Width Fixes

## Ziele

1. **Content-only Scroll auf Legal Notice / Privacy Policy / Help / Board**  
   Header + Sidebar (Desktop) und Mobile-Header + Mobile-Nav (Mobile) sollen immer sichtbar bleiben; nur der Content-Bereich scrollt.
2. **Add-Contact-Button @1247px**  
   Zwischen 1141–1250px ragt der Add-Contact-Button rechts aus der 370px-breiten Contacts-Sidebar heraus.
3. **Contacts-Sektionsbuchstaben (A/B/C…) verschwinden**  
   Beim schmalen Zusammenziehen des Viewports (unter 1250px, bevor mobile @800px greift) werden die Buchstaben-Header links abgeschnitten.

## Root Cause Analyse

### Ziel 1 — Fixed Mobile-Header

Aktuell in `sidebarHeader.css`:
- Desktop: `.desktop-header { position: fixed }` + `body { padding-top: 96px }` @801px+ → Header + Sidebar bleiben, Body scrollt. **Passt schon.**
- Mobile (`max-width: 800px`): `.mobile-header { display: flex; padding: 1em; z-index: 100 }` — **NICHT** `position: fixed`. Beim Scrollen verschwindet der Mobile-Header nach oben.
- `.mobile-nav` ist bereits `position: fixed; bottom: 0` → bleibt sichtbar.

Fix: Mobile-Header ebenfalls `position: fixed; top: 0`, aber nur für die 4 spezifischen Seiten (via Body-Klasse), damit Contacts/Summary/Task/etc. nicht kaputt gehen (dort ist die Content-Positionierung teilweise bereits auf einen fließenden Mobile-Header angepasst).

### Ziel 2 — Add-Contact-Button @1247px

`contactsResponsive.css` @1250px setzt `.contacts-main-container { width: 370px }`, aber die Padding-/Button-Regeln für den Add-Contact-FAB werden erst @1140px greifen:
- Basis (`contacts.css`): `.add-contact-container { padding: 22.5px 52px }` → 104px horizontales Padding.  
- Basis: `.add-contact { width: 352px }`.  
- 352 + 104 = 456px total; passt nicht in 370px-Sidebar → Button ragt sichtbar heraus.

Fix: Die Full-Width-Anpassung (`padding: 16px 20px; box-sizing: border-box; width: 100%; add-contact width: 100%`) auch schon @1250px greifen lassen.

### Ziel 3 — Sektionsbuchstaben werden abgeschnitten

`contacts.css` Basis:
- `.contact-list { align-items: center }` — zentriert Flex-Children (jede Zeile) auf der Cross-Achse.  
- `.contacts-first-letter-container { width: 352px; padding-left: 36px }`.

Bei @1250px wird `.contacts-main-container { width: 370px }`, bei @1140px 340px, @1040px 300px, @950px 260px. Sobald Main-Container schmaler als 352px wird, überragt der 352px-breite Buchstaben-Container die Sidebar auf beiden Seiten (weil `.contact-list` mit `align-items: center` zentriert). `.contacts-main-container { overflow-x: hidden }` klippt den linken Überhang → der Buchstabe (bei padding-left: 36px innerhalb des 352px-Containers) rutscht in den unsichtbaren Bereich.

Bei 340px Main-Container: Letter-Container 352px → Overhang je Seite (352-340)/2 = 6px links. Letter bei 36px sichtbar bei 36-6=30px.  
Bei 300px Main-Container: Overhang 26px → Letter bei 36-26=10px sichtbar (aber Padding-Right der Main-Container kann greifen).  
Bei 260px Main-Container: Overhang 46px → Letter bei 36-46=-10px → **abgeschnitten**.

Fix: `.contacts-first-letter-container` an schmalen Breakpoints auf `width: 100%; padding-left: 20px; box-sizing: border-box` setzen. Oder pauschal `.contact-list { align-items: stretch }` unter 1250px. Nehme die zweite Variante (weniger Regeln, robuster).

## Änderungen

### `styles/sidebarHeader.css`

Neue Mobile-Regeln unter dem Block `@media (max-width: 800px)`:
```css
body.body-fixed-chrome {
  padding-top: 88px;  /* mobile-header content 56px + padding 32px */
}
body.body-fixed-chrome .mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  z-index: 100;
}
```

Der Body-Klassen-Guard verhindert Nebenwirkungen auf Contacts (calc-basierte Höhen) / Summary (eigene Transforms).

### `styles/contactsResponsive.css`

**Im `@media (max-width: 1250px)`-Block** (Ziel 2 + 3): 
```css
.contact-list {
  align-items: stretch;              /* verhindert horizontales Clipping der Letter-Container */
}
.contacts-first-letter-container {
  width: 100%;
  padding-left: 20px;
  box-sizing: border-box;
}
.add-contact-container {
  padding: 16px 20px;
  box-sizing: border-box;
  width: 100%;
}
.add-contact {
  width: 100%;
}
.add-button-text {
  font-size: 18px;
  white-space: nowrap;
}
.person-add-png {
  margin-left: 12px;
  flex-shrink: 0;
}
```

### HTML

`class="body-fixed-chrome"` an `<body>` von:
- `legalNotice.html`
- `privacy.html`
- `help.html`
- `board.html`

## Verifikation

1. Legal/Privacy/Help/Board auf Mobile-Viewport (≤800px): beim Scrollen bleibt Mobile-Header oben, Mobile-Nav unten, nur der Content dazwischen scrollt.
2. Contacts-Seite auf 1247px: Add-Contact-Button sitzt sauber innerhalb der 370px-Sidebar, kein Überstand.
3. Contacts-Seite bei 1200/1000/900px: Sektionsbuchstaben (A/B/C) links sichtbar, nicht abgeschnitten.
