---
slug: popups-smaller-desktop
date: 2026-07-10
type: quick
status: complete
---

# Summary — Add/Edit Contact Popup kleiner + Sidebar-Kollision behoben

## Änderungen

### `styles/addContacts.css` & `styles/editContacts.css` (synchron)

Neue kleinere Grundgrößen (~ Faktor 0.78 zum vorigen Default):

| Element | vorher | nachher |
|--|--|--|
| `.popUpContent` | 745 × 594 | **570 × 460** |
| `.popUpBanner` padding | 50 | 40 |
| h1 | 61 | 48 (+ `white-space: nowrap`) |
| p (Untertitel) | 27 | 21 |
| Join-Logo | 62 × 62 | 48 × 48 |
| Blaue Trennlinie | 90 | 70 |
| `.closePopUp` | 32 × 32, top/right 48 | 26 × 26, top/right 36 |
| Avatar | 120 × 120 | 94 × 94 |
| Form width/height | 425 × 210 | 360 × 175 |
| Form form width / gap | 390 / 32 | 340 / 24 |
| Input padding / font | 13 21 / 16 | 10 16 / 15 |
| Cancel-Button | 20 / 15 | 16 / 12 |
| Primary-Button | 21 / 16 | 17 / 13 |

Neu:
```css
.popUpButton .cancelButton,
.popUpButton .createContactButton { flex-shrink: 0; }
.popUpButton p { white-space: nowrap; }
```
→ verhindert Umbruch von "Create contact" und macht Buttons dimensional stabil.

### Sidebar-Kollision

Neu in beiden Dateien:
```css
@media (min-width: 801px) {
  .addContactContainer {
    padding-left: 232px;
    box-sizing: border-box;
  }
}
```
Overlay bleibt vollbreit (Backdrop deckt Sidebar mit ab), aber das Popup wird per Flex-Center im Raum rechts der 232 px Sidebar zentriert.

### `styles/addContactsResponsive.css` & `styles/editContactsResponsive.css`

- `@media (max-width: 1250px)`: **entfernt** — vergrößerte das Popup wieder auf 520/520 (obsolet gegenüber neuem Default 570).
- `@media (max-width: 1150px)` mit `position:absolute` / negativen margins: **entfernt**.
- Neu `@media (max-width: 1050px)`: Content 480 × 420, h1 40 px, Banner-Padding 32, Form 320 × 20-gap — hält das Popup unter viewport-232 auch bei kleineren Desktop-Auflösungen.
- Mobile Breakpoints (@850, @760, kleiner) unverändert.

## Verifikation

Headless-Chrome-Screenshots mit sichtbarer 232-px-Sidebar bei viewport-Breiten 1920 / 1440 / 1250 / 1150 / 1050 px:
- Popup linke Kante > 232 px in allen Fällen (nie hinter der Sidebar).
- Add und Edit Popup layout-identisch bis auf Titel / Untertitel / Buttonbeschriftung.
- Titel "Add contact" / "Edit contact" und Button "Create contact" bleiben einzeilig.

## Geänderte Dateien

- `styles/addContacts.css`
- `styles/addContactsResponsive.css`
- `styles/editContacts.css`
- `styles/editContactsResponsive.css`
