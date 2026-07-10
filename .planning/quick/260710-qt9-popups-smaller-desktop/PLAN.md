---
slug: popups-smaller-desktop
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Add/Edit Contact Popup kleiner + hinter Sidebar rutschen verhindern

## Ziel

Die Add-Contact- und Edit-Contact-Popups sind auf Desktop-Auflösungen um 1440 px so groß, dass sie hinter der fixierten Sidebar (232 px) verschwinden. Popup verkleinern und zusätzlich sicherstellen, dass es nie hinter die Sidebar rutscht.

## Analyse

- Popup total: Banner (~467) + Content (745) = 1212 px.
- Overlay ist `.addContactContainer` mit `position: fixed; width: 100%` und `justify-content: center` — zentriert im **gesamten** Viewport, ignoriert die 232-px-Sidebar links.
- Bei 1440 viewport: `(1440 - 1212)/2 = 114 px` linker Rand — Sidebar (232) überlappt Popup um 118 px.
- Zusätzlich vergrößerten Responsive-Regeln @1250 (banner/content 520/520 = 1040) und @1150 (420/420 = 840) das Popup — die waren für den alten großen Default gedacht und heute obsolet/kontraproduktiv.

## Änderungen

### 1. Popup-Grundgrößen runterskalieren (~ Faktor 0.78)

`styles/addContacts.css` & `styles/editContacts.css` synchron:
- `.popUpContent`: 745x594 → **570x460**
- `.popUpBanner { padding: 40 }` (war 50)
- `.popUpBannerContent h1 { font-size: 48; white-space: nowrap }` (war 61, nowrap gegen Umbruch bei mittlerer Breite)
- `.popUpBannerContent p { font-size: 21 }` (war 27)
- `.joinLogo`/`.joinPopupImg`: 62x62 → **48x48**
- `.popUpBannerContent span { width: 70 }` (war 90)
- `.closePopUp { top: 36; right: 36; height: 26; width: 26 }` (war 48/48/32/32)
- `.popUpImg { top: 158; right: 415 }` — proportional zum kleineren Content
- `.contactImg { width: 94; height: 94; font-size: 37; border-radius: 60; border: 2px solid white }` (war 120)
- `.form { width: 360; height: 175; top: 105; right: 32 }` (war 425/210/134/48)
- `.form form { width: 340; gap: 24 }` (war 390/32)
- `.popUpButton`: kein `width` mehr, `gap: 16`, Kinder mit `flex-shrink: 0` und `.popUpButton p { white-space: nowrap }` — verhindert "Create contact"-Zeilenumbruch
- `.input { padding: 10 16 }` (war 13 21)
- `.inputInput { font-size: 15 }` (war 16), Icon-Position `top: 11; right: 16`
- `.cancelButton { font-size: 16; padding: 12 }` (war 20/15)
- `.createContactButton { font-size: 17; padding: 13 }` (war 21/16)

Neue Popup-Total-Breite: ~900 px.

### 2. Overlay zentriert rechts der Sidebar

Neu in beiden CSS-Dateien:

```css
@media (min-width: 801px) {
  .addContactContainer {
    padding-left: 232px;
    box-sizing: border-box;
  }
}
```

Effekt: Der Flex-Center-Bereich beginnt bei 232 px (rechts der Sidebar). Backdrop bleibt vollflächig. Sidebar sichtbar unter dem Backdrop.

### 3. Responsive-Rules aufräumen

`addContactsResponsive.css` & `editContactsResponsive.css`:
- `@media (max-width: 1250px)` **entfernt** — vergrößerte Popup wieder zu 520/520 (obsolet gegenüber neuem Default 570).
- `@media (max-width: 1150px)` mit alten broken Absolute-Overrides **entfernt**.
- Neu `@media (max-width: 1050px)`: reduziert Popup weiter (Content 480, h1 40, Banner-Padding 32, Form 320) — für viewports, wo `(vp - 232) < ~950` und Default nicht mehr passt.
- `@850` und `@760` (Mobile-Layout) bleiben unverändert.

## Verifikation

Headless-Chrome-Screenshots mit sichtbarer Sidebar bei 1920/1440/1250/1150/1050 px:
- Popup nie überlappend mit Sidebar (linker Rand > 232 px).
- Add und Edit Popup layout-identisch (bis auf Titel/Untertitel/Buttonbeschriftung).
- "Create contact" und "Add contact"-Titel nie umgebrochen.
