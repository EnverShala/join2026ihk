---
slug: contacts-polish-signup-blur-addcontact-validation
date: 2026-07-10
type: quick
status: complete
---

# Summary — Contacts Polish + Signup onblur + AddContact Custom Validation

## Changes

### 1. Contacts responsive polish

**`styles/contacts.css`** — `.span-txt`:
- `width: auto; height: auto; white-space: nowrap;` (bisher `width: 235px; height: 32px` → Text „Better with a team" wrap-te ab 27px Font-Size).

**`styles/contactsResponsive.css`**
- `@media (max-width: 1315px)` `.span-txt`: `height: 62px` entfernt (redundant nach nowrap).
- `@media (max-width: 1040px)` neu:
  ```css
  .ellipse-container { width: 92px; height: 92px; }
  .ellipse { width: 84px; height: 84px; font-size: 38px; }
  ```
  Sanfter Übergang zwischen Base 100 (≥1041) und @950 (76). Beseitigt den Sprung „ab 951 plötzlich groß".
- `@media (max-width: 535px)` `.back-arrow-on-responsive`: `top: 50px → 65px` (sitzt jetzt auf ähnlicher Höhe wie im @800-Block).

### 2. Signup — onblur statt oninput für Required-Meldungen

**`js/signup.js`**
- Neu: `const touchedSignupFields = new Set()` + `markSignupFieldTouched(id)` (fügt Feld in Set + triggert `checkSignUpButton()` → alle `checkX()` laufen neu).
- `checkName / checkEmail / checkPassword / clearPasswordMismatchMessage` prüfen jetzt `touchedSignupFields.has(id)` bevor sie die Required-Meldung anzeigen. Solange ein Feld nicht touched ist, bleibt die Meldung ausgeblendet — auch bei ungültigem Zwischenwert während der Ersteingabe.

**`signup.html`**
- Jedes Input (`fullName`, `userEmail`, `userPassword`, `confirmPassword`) bekommt zusätzlich `onblur="markSignupFieldTouched('id')"`. `oninput` bleibt für Live-Button-State-Update.

### 3. AddContact / EditContact — Input-Breite + Custom-Validation

**`styles/addContacts.css`** + **`styles/editContacts.css`** — `.inputInput`:
- `width: 100%; padding: 0 32px 0 0; box-sizing: border-box; background: transparent; outline: none;` — Input füllt jetzt tatsächlich die Breite des optischen Rahmens (`.input` bei ~390px form-Breite), mit rechtsseitigem Reserved-Space für den Icon.

**`addContacts.html`** + **`editContacts.html`** — `<form>`:
- `novalidate` gesetzt → keine HTML5-Browser-Popups mehr.
- Name/Email/Phone-Inputs: `required` und `pattern` entfernt; `type="number"` bei Phone → `type="tel"` (akzeptiert `+`, `-`, Leerzeichen, Klammern).
- Jedes Input bekommt `onblur="validateContactField('name'|'email'|'phone')"` und `oninput="validateContactField(...)"` — live Feedback ohne Browser-Popup.
- Neu: `<div id="phone-error" class="input-error">Bitte gültige Telefonnummer eingeben (6–16 Zeichen, nur Ziffern, +, -, ( )).</div>` unter dem Phone-Input.
- Name-Error-Text präzisiert („Bitte einen Namen eingeben.").

**`js/contacts.js`**
- Neu: `CONTACT_PHONE_REGEX = /^[0-9\-+\s()]{6,16}$/`.
- Neu: `validateContactField(field)` — validiert und toggelt die Fehleranzeige eines einzelnen Feldes; returned Bool.
- `validateContactForm()` deutlich schlanker: ruft `validateContactField` für name/email/phone und returned die AND-Verknüpfung.

## Verifikation

- Contacts @400px: Back-Arrow sitzt bei ~65px statt vorher 50px (weniger „zu hoch").
- Contacts @980px: Ellipse-Container 92×92, Ellipse 84×84/38 — kein Sprung mehr von 76 auf 100.
- Contacts @1200–@800: „Better with a team" bleibt konsequent in einer Zeile (kein Umbruch mehr auf 2 Zeilen im @1315-Range).
- Signup: erstes Zeichen im Name-Feld → **keine** rote „Please enter your full name!"-Meldung. Fokus verlassen (blur) mit ungültigem/leerem Wert → Meldung erscheint. Weiter tippen live-updated.
- AddContact Desktop: Input-Felder füllen sichtbar die volle Rahmenbreite (nicht mehr ~200px). Kein HTML5-Popup mehr; stattdessen rote Custom-Zeile mit deutschem Text unter dem Feld.

## Geänderte Dateien

- `styles/contacts.css`, `styles/contactsResponsive.css`
- `styles/addContacts.css`, `styles/editContacts.css`
- `js/signup.js`, `js/contacts.js`
- `signup.html`, `addContacts.html`, `editContacts.html`
