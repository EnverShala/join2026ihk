---
slug: contacts-mobile-fab-and-list
date: 2026-07-09
type: quick
status: complete
---

# Summary — Contacts Mobile: FAB + Screenshot-Look

## Changes (`styles/contactsResponsive.css`)

### @799px Block umgebaut

- **Container**: `padding: 12px 16px 120px` (Platz für FAB unten), `box-sizing: border-box`. `padding-top: 50px` entfernt.
- **Buchstaben-Header** (`.contacts-first-letter-container`): `width: 100%; padding: 16px 8px 4px; gap: 0; justify-content: flex-start`; Buchstabe bleibt 20px.
- **Divider** (`.border-container` + `.border`): 100% breit, linksbündig, `#d1d1d1`.
- **Zeile** (`.contact-container`): `width: 100%; padding: 10px 12px; gap: 16px; justify-content: flex-start`; Name 20px, Email 14px linkig blau (bereits vorhanden).
- **Kein breiter Add-Button mehr — FAB stattdessen**:
  - `.add-contact-container`: `position: fixed; right: 16px; bottom: calc(96px + 16px); left: auto; width: auto; z-index: 20`.
  - `.add-contact-container .add-contact`: 56×56, `border-radius: 50%`, `background: #2a3647`, `box-shadow: 0 4px 8px rgba(0,0,0,.25)`, Hover → Cyan.
  - `.add-button-text { display: none }`; `.person-add-png` auf 24×24.

### @535px + @420px

- Regeln `.add-contact, .border, .contact-container { width: 400/280px }` entfernt — der 799px-Block liefert jetzt `width: 100%`, damit Liste + Divider bis zum Rand ausgehen.

## Warum die JS-Toggles weiter funktionieren

`hideContactsListInResponsiveMode()` und `showContactListAgainInResponsiveMode()` setzen nur `add-contact-container.style.display = "none"` bzw. `"flex"`. Alles andere (`position: fixed`, Größe, Placement) kommt aus CSS und bleibt erhalten. FAB verschwindet in Detail-Ansicht, kommt bei Rückkehr zur Liste wieder.

## Verification

- Mobile ≤799px: FAB unten rechts als dunkler Kreis; Liste linksbündig; Buchstaben-Header mit Divider drunter — matcht Screenshot.
- Tap auf FAB → `addNewUser()` öffnet Add-Contact-Popup (unverändert).
- Kein Text-Overflow: Email-Zeile bleibt via `text-overflow: ellipsis` gekürzt.
- Scroll: 120px Padding-Bottom stellt sicher, dass die letzte Zeile nicht vom FAB überdeckt wird.
