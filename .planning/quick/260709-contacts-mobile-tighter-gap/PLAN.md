---
slug: contacts-mobile-tighter-gap
date: 2026-07-09
type: quick
---

# Contacts Mobile ≤420px: Abstand Ellipse ↔ Name reduzieren

## Problem

`.contact-container` erbt bei ≤420px noch den Gap-Wert vom @800px-Breakpoint (`gap: 16px`, `contactsResponsive.css:339`). Der Kreis mit den Initialen (42px) und der Name-/Email-Column stehen dadurch mit für so kleine Viewports (375–420px) sichtbar zu großem Abstand voneinander.

## Fix

`styles/contactsResponsive.css` @420px — im existierenden `@media (max-width: 420px)`-Block: `.contact-container { gap: 8px }` ergänzen (Halbierung des @800px-Werts).

## Verification

- Contacts-Seite @420px / @375px: Kreis und Name sitzen enger zusammen, keine zu weite Lücke mehr.
- Kein Overflow, Ellipsis auf Email-Line greift wie vorher.
