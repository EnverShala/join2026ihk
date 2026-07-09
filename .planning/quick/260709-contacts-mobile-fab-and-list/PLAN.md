---
slug: contacts-mobile-fab-and-list
date: 2026-07-09
type: quick
---

# Contacts Mobile: FAB + Screenshot-Look

## Ziel

Contacts-Seite auf Mobile (≤799px) sieht aus wie der Screenshot:

1. **Kein breiter "Add new contact"-Button** oben in der Liste. Stattdessen ein **kreisförmiger, sticky Floating-Action-Button** (dunkel-navy, 56×56) unten rechts oberhalb der `mobile-nav` (96px).
2. **Liste linksbündig eingerückt**, Buchstaben-Header groß und minimal, Divider darunter über die Breite.
3. **Zeile pro Kontakt**: Avatar (42px) + Name (dunkel) + Email (`#007cee`), sauberes vertikales Alignment, nicht zentriert.

## Änderungen (nur CSS, keine HTML/JS-Änderungen)

### `styles/contactsResponsive.css` — `@media (max-width: 799px)` Block umbauen

1. `.contacts-main-container`: `padding: 12px 16px 120px` (Platz unten für FAB), `padding-top: 12px` (kein 50px extra Space).
2. **Buchstaben-Header**:
   - `.contacts-first-letter-container` → `width: 100%; padding: 16px 8px 4px; justify-content: flex-start; gap: 0`.
   - `.contacts-first-letter` → `font-size: 20px`.
3. **Divider**:
   - `.border-container` → `width: 100%; padding: 4px 0 8px`.
   - `.border` → `width: 100%; border-color: #d1d1d1`.
4. **Contact-Zeile**:
   - `.contact-container` → `width: 100%; padding: 10px 12px; gap: 16px; box-sizing: border-box; justify-content: flex-start`.
   - `.contact-list-name` → `width: auto; font-size: 20px`.
   - `.contact-list-email` → `font-size: 14px`.
5. **FAB (statt des breiten Buttons)**:
   - `.add-contact-container` → `position: fixed; right: 16px; bottom: calc(96px + 16px); left: auto; padding: 0; margin: 0; width: auto; z-index: 20`.
   - `.add-contact` → `width: 56px; height: 56px; border-radius: 50%; padding: 0; background-color: #2a3647; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.25)`.
   - `.add-button-text { display: none }`.
   - `.person-add-png { margin: 0; width: 24px; height: 24px }`.
6. Bereits vorhandene 535/420px-Overrides mit `.add-contact { width: 400px }` bzw. `280px` müssen zurückgezogen werden für den FAB — ich setze das `width` auf `56px` mit hoher Spezifität via z.B. `.add-contact-container .add-contact` im 799px Block oder überschreibe pro Breakpoint.

## Was NICHT geändert wird

- HTML-Struktur (`add-contact-container` / `add-contact-ButtonID` bleiben).
- JS-Handler (`onclick="addNewUser()"`) bleiben.
- Desktop-Layout ≥800px unverändert.

## Verification

- Mobile ≤799px: nur ein dunkler kreisrunder Button unten rechts sichtbar; Liste linksbündig; Buchstaben-Header + Divider wie Screenshot.
- Klick auf FAB öffnet Add-Contact-Popup (bestehende Funktion `addNewUser()`).
- Detail-Ansicht ausblenden: JS setzt `add-contact-container.style.display = "none"` — FAB verschwindet in Detail-Ansicht. Wieder sichtbar bei Rückkehr zur Liste.
- Kein Overflow: Liste hat unten 120px Padding, letzter Kontakt ist scrollbar über FAB.
