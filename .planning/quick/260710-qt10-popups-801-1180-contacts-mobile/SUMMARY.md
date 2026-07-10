---
slug: popups-801-1180-contacts-mobile
date: 2026-07-10
type: quick
status: complete
---

# Summary — Popup 801-1180 + Mobile Contacts

## Änderungen

### `styles/addContactsResponsive.css` + `styles/editContactsResponsive.css`

Der Zwischenbereich zwischen Default-Popup (900 total) und Mobile-Column-Layout (@760) war zu grob. Neue gestaffelte Progression:

| Breakpoint | Content | Banner-Padding | h1 | Avatar | Form | Total ≈ |
|--|--|--|--|--|--|--|
| Default ≥1181 | 570 × 460 | 40 | 48 | 94 | 360 | 900 |
| **@1180 (neu)** | 460 × 420 | 32 | 40 | 78 | 320 | 730 |
| **@980 (neu)** | 380 × 380 | 24 | 34 | 68 | 260 | 580 |
| **@850 (überarbeitet)** | 300 × 340 | 20 | 28 | 60 | 210 | 460 |

Alter @1050-Breakpoint entfernt. Alter @850 mit `width: 320/420` (740 total) entfernt. Avatar-`.popUpImg`-Positionen (`top`/`right`) je Stufe angepasst, damit er zentriert über der Banner/Content-Grenze sitzt und nicht ins Formular ragt.

### `styles/contactsResponsive.css` — Mobile Kontakt-Liste E-Mail

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
  overflow: hidden !important;
}
```

E-Mail wrappt jetzt auf mehrere Zeilen statt mit ellipsis abgeschnitten zu werden.

**Chrome-Quirk:** `flex: 1 1 0` mit `min-width: 0` und `word-break: break-all` sollte theoretisch das Flex-Item shrinken lassen und Text wrappen. In Chrome-Headless und Edge tut es das nicht. Nur `flex: 0 1 <vw-Wert>` als expliziter Basis-Wert erzeugt den gewünschten Wrap. Deshalb der `74vw`-Wert.

### `styles/contactsResponsive.css` — Mobile Kontakt-Detail

`.display-contact` von `position: fixed; top: 280; left: 150` auf **normaler Flow** umgestellt (`position: static; width: 100%; padding: 8px 16px 96px; gap: 20`). Damit passt sich das Detail an jede Mobile-Breite an.

Layout:
- Header-Row: Avatar 80×80 (Ellipse 72×72) links + Name-Container flex rechts (gap 16).
- Name: Font 28, wrappt bei Bedarf (`overflow-wrap: anywhere`, `word-break: break-word`, `text-wrap: wrap`, `!important` gegen die `white-space: nowrap`-Regel in `contacts.css`).
- Edit/Delete unter dem Namen als Icon+Text (14px).
- "Contact Information" Sub-Header.
- Email + Phone jeweils Label (14, bold) + Wert (15, break-all bei Email).

Name-/Email-Breite per **Fixed-px** in nested media queries (Chrome-Quirk workaround):

| Breakpoint | Name-Container / Email-Container |
|--|--|
| @800 | 500px |
| @600 | 300px |
| @420 | 220px / 260px |

Kleiner Avatar (60×60) und schmalerer Name-Container bei @420. Legacy-`left: 80/40/20`-Overrides bei @696/@570/@535 entfernt.

## Verifikation

Headless-Chrome-Screenshots:

**Popup bei viewport 1180/1050/950/850/810 mit sichtbarer 232px Sidebar:**
- Popup nie hinter Sidebar.
- Add und Edit spiegelbildlich.
- Titel und "Create contact"-Button einzeilig.

**Mobile Kontakt-Liste bei 375/500/760:**
- Auch lange E-Mails komplett sichtbar (wrappt auf mehrere Zeilen).

**Mobile Kontakt-Detail bei 375/500/760:**
- Name wrappt bei Bedarf.
- E-Mail wrappt komplett.
- Layout klar strukturiert, keine Positioning-Sprünge zwischen Breakpoints.

## Geänderte Dateien

- `styles/addContactsResponsive.css`
- `styles/editContactsResponsive.css`
- `styles/contactsResponsive.css`
