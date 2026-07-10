---
slug: popups-801-1180-contacts-mobile
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Popup 801-1180 verkleinern + Mobile Contacts Layout

## Ziel

Drei Sachen:
1. Add/Edit Contact Popup bei viewport 801-1180 ist noch zu groß und rutscht hinter die Sidebar.
2. In der mobilen Kontakt-Liste die kompletten E-Mails anzeigen (aktuell werden sie abgeschnitten).
3. Mobile Kontakt-Detail-Ansicht am Figma-Design orientieren.

## Analyse

### Problem 1: Popup 801-1180
Nach vorheriger Session war Popup default 900 total. Mit `padding-left: 232px` blieb es rechts der Sidebar bei 1440 clean. Aber @1050 breakpoint war der einzige Zwischenschritt (Content 480, Banner ~330 = ~810 total). Bei viewport 1050 verfügbar 818 → passt gerade so. Bei viewport 950-950 verfügbar 718 → 810 overflow um 92px. Zwischen 851-1050 war das ganze zu groß.

@850 breakpoint hatte broken banner 320+content 420=740 setup — bei viewport 850 verfügbar 618, overflow 122.

### Problem 2: E-Mail-Liste mobile
`.contact { width: 140px }` in contacts.css und `.contact-list-email { max-width: 220px; white-space: nowrap }` in @1140 breakpoint. Bei mobile werden E-Mails auf 220 gekürzt mit ellipsis.

Zusätzlich: Chrome hat einen subtilen Bug (oder ich verstehe die Interaktion nicht), wo `calc(100vw - X)` und `calc(100% - X)` als flex-basis/max-width NICHT auf das flex-item angewendet werden. Nur fixed pixel values funktionieren zuverlässig als flex-basis in `.contact` und `.contact-name-container`.

### Problem 3: Mobile Detail Layout
`.display-contact { position: fixed; top: 280; left: 150 }` in @800 lässt das Panel fixed positioniert. Andere Breakpoints hatten `left: 80, left: 40, left: 20` und viele `width: 550px, 450px, 260px` mit widersprüchlichen Werten. Name wurde durch `white-space: nowrap` in contacts.css nicht gewrappt. Alles chaotisch.

## Änderungen

### `styles/addContactsResponsive.css` + `styles/editContactsResponsive.css` (synchron)

Alte @1050 Regel entfernt. Neue Progression:
- Default (≥1181): Content 570 × 460, Banner-Padding 40, h1 48 (nowrap) → ~900 total
- **@1180 (neu)**: Content 460 × 420, padding 32, h1 40, Avatar 78, Form 320 → ~730 total
- **@980 (neu)**: Content 380 × 380, padding 24, h1 34, Avatar 68, Form 260, Inputs kleiner → ~580 total
- **@850 (überarbeitet)**: Content 300 × 340, padding 20, h1 28, Avatar 60, Form 210 → ~460 total
- @760: bestehend (mobile column layout)

Avatar-Positionen an jede Stufe angepasst, damit er über der banner/content-Grenze sitzt und nicht in die Form ragt.

### `styles/contactsResponsive.css` — Mobile List E-Mail

`.contact` bekommt `flex: 0 1 74vw` (funktioniert nur mit `flex-basis`, nicht `flex: 1 1 0` — Chrome-Quirk):
```css
.contact {
  flex: 0 1 74vw !important;
  min-width: 0 !important;
  overflow: hidden !important;
}
.contact-list-email {
  white-space: normal !important;
  overflow-wrap: anywhere !important;
  word-break: break-all !important;
}
```

Damit wrappen komplette E-Mails auf mobile, keine ellipsis.

### `styles/contactsResponsive.css` — Mobile Detail

`.display-contact` von `position: fixed` mit `left:150` etc. auf **normaler Flow** umgestellt:
- `position: static`, `width: 100%`, `padding: 8px 16px 96px`, `gap: 20`.
- `.contact-name-main-container` flex row, gap 16, avatar 80 fix + name-container flex.
- `.contact-name-container` mit `width: 500px` (default) und tieferen media queries `@600: 300px, @420: 220px` — Chrome-Quirk workaround, damit Name mit `word-break` wrappen kann.
- `.contact-name`, `.span-contact-name` mit `white-space: normal`, `text-wrap: wrap`, `overflow-wrap: anywhere`.
- `.email` und `.phone` mit break-all und fixed max-width per breakpoint.
- `.ellipse` mobile 72px (statt 100px), `.ellipse-container` 80x80.
- Alle `left: X` overrides in @696, @570, @535 breakpoints entfernt (obsolet).

## Verifikation

Headless-Chrome-Screenshots:
- Popup bei viewport 1180/1050/950/850/810 (mit sichtbarer 232px Sidebar): Popup nie hinter Sidebar, immer clear.
- Mobile Kontakt-Liste bei 375/500/760: komplette E-Mail sichtbar (wrappt bei Bedarf).
- Mobile Kontakt-Detail bei 375/500/760: Name wrappt bei Bedarf, E-Mail wrappt, Layout sauber.
