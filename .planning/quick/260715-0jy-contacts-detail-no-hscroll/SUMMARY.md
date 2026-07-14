---
type: quick-summary
slug: contacts-detail-no-hscroll
quick_id: 260715-0jy
created: 2026-07-15
completed: 2026-07-15
status: complete
---

# Summary: Contact-Detail — kein horizontaler Scrollbalken mehr

## Root Cause
`.contact-name-container` mit `flex: 0 0 auto !important; width: Xpx` (starr,
nicht schrumpfbar) im `@media (max-width: 800/600/420px)`-Kaskaden. Zusammen
mit `.ellipse-container` (80/64px) und Gap 16px im Parent `.contact-name-main-container`
(`flex-wrap: nowrap`) übersteigt der Mindestbedarf bei bestimmten Viewport-
Breiten die Content-Area von `.display-contact` (viewport − 32px durch
`padding: 8px 16px`).

- 800: 500 + 80 + 16 = 596 → Overflow bei viewport 601–627.
- 600: 300 + 80 + 16 = 396 → Overflow bei viewport 421–427.
- 420: 220 + 64 + 16 = 300 → Overflow bei viewport <332.

`.email-container / .phone-container` hatten dasselbe `width: Xpx !important`-
Muster, waren aber durch `max-width: 100% !important` bereits abgesichert.

## Änderungen
**`styles/contactsResponsive.css`, `@media (max-width: 800px)`:**
- `.display-contact`: `overflow-x: hidden` + `min-width: 0` ergänzt.
- `.contact-name-main-container`: `min-width: 0` ergänzt.
- `.contact-name-container`: `flex: 0 0 auto !important; width: 500px` →
  `flex: 0 1 auto !important; width: 100%; max-width: 500px`.
- `.email-container, .phone-container`: `width: 500px !important; max-width: 100%`
  → `width: 100% !important; max-width: 500px !important`.

**`@media (max-width: 600px)`:**
- `.contact-name-container`: `width: 300px; max-width: 300px` →
  `width: 100%; max-width: 300px`.
- `.email-container, .phone-container`: `width: 300px !important` →
  `width: 100% !important; max-width: 300px !important`.

**`@media (max-width: 420px)`:**
- Analog: 220px starr → `width: 100%; max-width: 220px`.
- E-Mail/Phone-Container: `width: 260px !important` →
  `width: 100% !important; max-width: 260px !important`.

**`styles/contacts.css`, `.display-contact` (base/Desktop):**
- `overflow-x: hidden` + `min-width: 0` als defensive Guard, falls ein sehr
  langer Kontaktname (`.contact-name` hat `white-space: nowrap` ohne
  eigenes Overflow-Handling) auf Desktop überliefe.

## Manuelle Prüfung
Contact-Detail bei viewports 320, 400, 425, 500, 620, 720, 800, 900, 1140,
1315, 1600 öffnen — nirgends darf ein horizontaler Scrollbalken erscheinen,
und das Layout darf nicht seitlich abgeschnitten sein.
