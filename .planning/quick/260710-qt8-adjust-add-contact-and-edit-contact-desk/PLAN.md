---
slug: adjust-add-contact-and-edit-contact-desk
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Add/Edit Contact Desktop-Optik angleichen

## Ziel

Add-Contact- und Edit-Contact-Popup sollen auf Desktop optisch identisch aussehen (spiegelbildlich, nur Titel/Untertitel/Buttons unterscheiden sich). Aktuell driften sie durch Divergenzen in `editContacts.css` / `editContactsResponsive.css` auseinander.

## Analyse

`contacts.html` lädt beide CSS-Dateien (`addContacts.css`, `editContacts.css`) und deren Responsive-Varianten. Da `editContacts.css` nach `addContacts.css` geladen wird, überschreiben Regeln aus `editContacts.css` gleichnamige Selektoren.

Konkret gefunden:

1. **`.popUpButton` broken im edit**: `position: absolute; margin-top: 70%; margin-left: 1%` → Buttons weit unter dem Formular. Fix per `.add-contact-dialog .popUpButton`-Override greift nicht (Edit hat keinen `add-contact-dialog`-Marker).
2. **`.popUpBanner` Padding weicht ab**: `66px 48px` (edit) vs `50px` (add) → Logo/Titel-Position unterschiedlich. Zusätzlich `height: 594px` fest.
3. **`.addContactContainer` divergent**: `rgba(0,0,0,0.01)` vs `rgba(0,0,0,0.3)` (Backdrop-Opazität) und `z-index: 300` vs `3`. Da edit später lädt, gilt fast-transparent für BEIDE Popups.
4. **`.joinPopupImg` (edit-Logo-Klasse) hat keine Größenregel** — im edit hat das Logo intrinsische SVG-Größe statt 62×62.
5. **Button-Reihenfolge in `editContacts.html`** ist Save→Delete (primär links, sekundär rechts) — invers zu Figma und zu addContacts (Cancel/Create).
6. **Responsive-Breakpoints in editContactsResponsive.css divergent**:
   - `left: 5%/7%/8%` bei 1630/1525/1463 verschiebt das Popup horizontal weg von der Mitte (addContact tut das nicht → sichtbarer Positionsversatz).
   - `.popUpButton { margin-top: -35% }` @1435, `.popUpButton { position: absolute; margin-top: -140% }` @1311 — kaputte Overrides.
   - Breakpoint-Werte (1435/1311/1091) matchen nicht die von addContactsResponsive (1250/1150/850).

## Änderungen

### `editContacts.html`
- Button-Reihenfolge: **Delete** (sekundär) links, **Save** (primär) rechts — spiegelt Add-Layout.

### `styles/editContacts.css`
- `.addContactContainer`: `z-index: 3`, `background-color: rgba(0,0,0,0.3)` (identisch zu addContacts).
- `.popUpContainer`: kein `z-index` mehr.
- `.popUpOpen`: kein `z-index: 9999` mehr.
- `.popUpBanner`: `padding: 50px`, `justify-content: center`, keine feste `height: 594px`, kein `position: relative`.
- `.popUpButton`: Flow-Layout (`display: flex; width: 370px; gap: 20px; margin-top: 0`) — kein `position: absolute` und keine `margin-top: 70%`-Zeitbombe mehr.
- Neu: `.joinPopupImg { height: 62px; width: 62px }` — analog zu `.joinLogo` in addContacts.

### `styles/editContactsResponsive.css`
- `left: 5%/7%/8%`-Shifts @1630/1525/1463 entfernt (verursachten Positionsversatz).
- Breakpoints umgestellt auf 1250/1150/850, matchen addContactsResponsive.
- `.popUpButton`-Overrides in Flow gebracht (kein `position: absolute`, keine negativen `margin-top`).

## Verifikation

- Headless-Chrome-Screenshots von `contacts.html`-Cascade (addContacts.css + editContacts.css beide geladen) bei 1440/1300/1200 px — Add- und Edit-Popup sind Layout-identisch bis auf Titel/Untertitel/Button-Beschriftung.
