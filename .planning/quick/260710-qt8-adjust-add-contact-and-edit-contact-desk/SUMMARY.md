---
slug: adjust-add-contact-and-edit-contact-desk
date: 2026-07-10
type: quick
status: complete
---

# Summary — Add/Edit Contact Desktop-Optik angleichen

Beide Popups sind auf Desktop jetzt spiegelbildlich; Divergenzen aus `editContacts.css` / `editContactsResponsive.css` behoben.

## Änderungen

### `editContacts.html`
- Button-Reihenfolge Delete (sekundär) → Save (primär), analog zu Add (Cancel → Create).

### `styles/editContacts.css`
- `.addContactContainer`: Backdrop `rgba(0,0,0,0.3)` und `z-index: 3` (matcht addContacts; überschrieb vorher fast-transparent + z:300 für BEIDE Popups durch Ladereihenfolge).
- `.popUpContainer`/`.popUpOpen`: divergente `z-index`-Werte entfernt.
- `.popUpBanner`: `padding: 50px`, `justify-content: center`, keine feste `height`, kein `position: relative` — matcht addContacts.
- `.popUpButton`: Flow-Layout `display:flex; width:370px; gap:20px; margin-top:0` — vorher `position:absolute; margin-top:70%` sprengte die Buttons unter das Formular.
- Neu: `.joinPopupImg { height:62px; width:62px }` — Logo im Edit-Banner hat jetzt dieselbe Größe wie das `.joinLogo` in Add.

### `styles/editContactsResponsive.css`
- `.popUpContainer { left: 5%/7%/8% }` bei 1630/1525/1463 entfernt (horizontaler Positionsversatz gegenüber Add).
- Desktop-Breakpoints auf 1250 / 1150 / 850 vereinheitlicht (matcht addContactsResponsive).
- `.popUpButton`-Overrides in Flow gebracht (kein `position:absolute`, keine negativen `margin-top`).

## Verifikation

Headless-Chrome-Screenshots bei 1440 / 1300 / 1200 px des `contacts.html`-Cascade-Kontexts (beide CSS-Dateien parallel geladen):
- Popup-Größe, Banner-Breite, Content-Breite: identisch.
- Logo-Größe/Position: identisch (62×62).
- Avatar-Kreis-Position: identisch.
- Formular-Position, Input-Layout: identisch.
- Button-Reihenfolge sekundär → primär: identisch.
- Add hat Untertitel "Tasks are better with a team!", Edit nicht — entspricht Figma.

## Geänderte Dateien

- `editContacts.html`
- `styles/editContacts.css`
- `styles/editContactsResponsive.css`
