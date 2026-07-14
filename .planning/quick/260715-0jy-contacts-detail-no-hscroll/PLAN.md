---
type: quick-plan
slug: contacts-detail-no-hscroll
quick_id: 260715-0jy
created: 2026-07-15
status: in-progress
---

# Quick Task: Contact-Details ohne horizontalen Scrollbalken

## Beobachtung
Im Contact-Detail (`#display-contactID` / `.display-contact`) auf `contacts.html`
erscheint bei manchen Viewport-Breiten ein horizontaler Scrollbalken. Muss
kategorisch verhindert werden.

## Root Cause
`styles/contactsResponsive.css`, `@media (max-width: 800px)`:

```css
.contact-name-container {
  flex: 0 0 auto !important;   /* nicht schrumpfbar */
  width: 500px;
  max-width: 500px;
  min-width: 0;
}
```

Parent `.contact-name-main-container` hat `flex-wrap: nowrap` und enthält
`.ellipse-container` (80px) + Gap 16px + `.contact-name-container` (starr 500px)
= 596px Mindestbedarf. `.display-contact` hat `padding: 8px 16px` mit
`box-sizing: border-box`; Content-Area = `viewport − 32`.

- Viewport 601–627px → Overflow 1–27px → horizontaler Scrollbalken.
- Analog bei `@media (max-width: 600px)`: 300px starr + 80 + 16 = 396 →
  Overflow bei viewport 421–427px.
- Analog bei `@media (max-width: 420px)`: 220 + 64 + 16 = 300 → Overflow
  bei viewport <332px.

Zusätzlich `.email-container, .phone-container { width: 500px !important }`
mit `max-width: 100%` sind zwar begrenzt, aber die selbe Konstruktion sollte
konsistent sein.

## Fix
1. `styles/contactsResponsive.css`, `@media (max-width: 800px)`:
   - `.contact-name-container`: `width: 500px` → weglassen, `flex: 0 1 auto`,
     `max-width: 500px` behalten, `width: 100%` als Fallback.
   - `.email-container, .phone-container`: `width: 500px !important` →
     `width: 100% !important; max-width: 500px !important`.
   - `.contact-name-main-container`: `min-width: 0` ergänzen (schadet nicht,
     hilft bei geschachteltem Flex).
   - `.display-contact`: `overflow-x: hidden` als Defensive.
2. `@media (max-width: 600px)`: `.contact-name-container { width: 300px }`
   → `max-width: 300px; width: 100%`. `.email-container, .phone-container`
   analog.
3. `@media (max-width: 420px)`: `.contact-name-container { width: 220px }`
   → `max-width: 220px; width: 100%`. `.email-container, .phone-container`
   analog.

## Nicht in scope
- Layout- oder Design-Änderungen jenseits von Overflow-Vermeidung.
- Kein Umbau der Desktop-Layouts (>1140px), da dort das Problem nicht auftritt.
