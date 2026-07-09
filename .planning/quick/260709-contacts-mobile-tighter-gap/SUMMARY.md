---
slug: contacts-mobile-tighter-gap
date: 2026-07-09
type: quick
status: complete
---

# Summary — Contacts Mobile ≤420px: engerer Abstand Ellipse ↔ Name

## Changes

### `styles/contactsResponsive.css` @420px
- `.contact-container { gap: 8px }` neu hinzugefügt (vorher geerbt: 16px vom @800px-Block). Halbiert die Lücke zwischen dem 42px-Kreis mit Initialen und der Name/Email-Spalte.

## Verification (visuell)

- Contacts-Seite @420px und @375px: Kreis sitzt jetzt näher am Namen, Layout wirkt kompakter ohne zu drängen.
- Rest der @420px-Regeln (Detail-View Ellipse, h1, span, Edit/Delete) unverändert.
