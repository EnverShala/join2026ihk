---
slug: contacts-polish-signup-blur-addcontact-validation
date: 2026-07-10
type: quick
status: in-progress
---

# Plan — Contacts Responsive Polish + Signup onblur + AddContact Custom Validation

## Ziele

1. Contacts back-arrow @≤535px sitzt zu hoch → minimal tiefer (Angleichung an @800 Position).
2. Contacts Ellipse ab 951px "springt" plötzlich auf Basis-Größe (100×100) — sanfter Übergang durch Zwischenwerte @1040 (+ optional @1140).
3. "Contacts | Better with a team" — Span-Text soll nirgends mehr umbrechen; einheitlich `white-space: nowrap; width: auto`.
4. Signup: `oninput`-Handler zeigen Required-Meldung sofort bei erstem Zeichen — soll erst nach Blur erscheinen. `oninput` weiterhin für Button-State-Update.
5. AddContact / EditContact Desktop: Input-Felder sollen tatsächlich so breit sein wie der optische Rahmen (Input momentan nicht auf 100%). HTML5-`required` durch Custom-Validation-Messages ersetzen; Phone-Feld bekommt eigene Custom-Message.

## Analyse

### 1. Back-arrow @535
`contactsResponsive.css` @535: `.back-arrow-on-responsive { top: 50px }`. Vorher @800: `top: 66px`. Fix: @535 → `top: 65px`.

### 2. Ellipse ≥951
Zwischen Breakpoint @950 (Ellipse 76×76/34) und @1040 (kein Override → base 100×100/47) gibt es einen Sprung von 24px. Fix: `.ellipse-container { width: 92px; height: 92px }` + `.ellipse { width: 84px; height: 84px; font-size: 38px }` in @1040 einfügen.

### 3. "Better with a team"
Basis `.span-txt { width: 235px; height: 32px }` klemmt den Text auf eine feste Breite. Text bei 27px füllt >235px → wraps. Fix: `contacts.css` Basis → `.span-txt { width: auto; height: auto; white-space: nowrap }`. Alle `height: 62px`/32px-Override in `contactsResponsive.css` @1315 raus (redundant). Existierende `text-wrap: nowrap` (in Mobile-Block) bleibt konsistent.

### 4. Signup — onblur

`signup.js`:
- Neues `const touchedSignupFields = new Set()`.
- Neu: `markSignupFieldTouched(id)` — fügt id in Set + ruft `checkSignUpButton()` (was intern alle `checkX()` triggert und bei touched-fields die Meldungen anzeigt).
- Jede `checkX()` (Name/Email/Password/ConfirmPassword) → prüft, ob field in `touchedSignupFields`. Wenn NICHT touched und ungültig → Message verbergen (aber `return false` für Button-State bleibt).

`signup.html`:
- Jedes Input bekommt `onblur="markSignupFieldTouched('inputId')"`. `oninput` bleibt für den Button-Enabler.

### 5. AddContact / EditContact

`styles/addContacts.css`:
- `.inputInput { width: 100% }` — Input füllt den `.input`-Container. `.input` hat aktuell keine explizite Width, aber liegt in `.form form { width: 390px }`. Input somit ~390 – 42 (padding) – ~24 (icon) ≈ 320px, statt browser-default (~200px).

`addContacts.html` + `editContacts.html`:
- `required` attribute an name/email/phone entfernen.
- `<form novalidate>` — zwingt Browser, keine HTML5-Validation-Popup zu zeigen.
- Neues `<div id="phone-error" class="input-error" style="display:none;">Bitte gültige Telefonnummer eingeben (6–16 Ziffern).</div>` unter dem Phone-Input.
- Custom Fehlermeldungen präzisieren:
  - name-error: „Bitte Namen eingeben."
  - email-error: „Bitte gültige E-Mail eingeben (z.B. name@example.de)."
  - phone-error: „Bitte gültige Telefonnummer eingeben (6–16 Ziffern)."
- Inputs bekommen `onblur="validateContactField('name'|'email'|'phone')"` — zeigt Error bei Blur, versteckt bei nächster Änderung/Blur wenn OK.

`js/contacts.js`:
- Neue `validateContactField(field)` — validiert einzelnes Feld, zeigt/verbirgt entsprechende Error-Message.
- `validateContactForm()` erweitert um Phone (Regex `/^[0-9\-+\s()]{6,16}$/`).

## Änderungen (Detail)

### `styles/contacts.css`
```css
.span-txt {
  /* width/height entfernen, dazu: */
  width: auto;
  height: auto;
  white-space: nowrap;
}
```

### `styles/contactsResponsive.css`

@1315 span-txt-Höhe raus (redundant nach nowrap).
@1040:
```css
.ellipse-container { width: 92px; height: 92px; }
.ellipse { width: 84px; height: 84px; font-size: 38px; }
```
@535 back-arrow:
```css
.back-arrow-on-responsive { top: 65px; }  /* statt 50px */
```

### `js/signup.js`
Touched-Set + markSignupFieldTouched + Anpassungen in check-Funktionen.

### `signup.html`
`onblur="markSignupFieldTouched('...')"` an fullName/userEmail/userPassword/confirmPassword.

### `styles/addContacts.css`
```css
.inputInput { width: 100%; background: transparent; outline: none; }
```
(background/outline defensiv gegen Focus-Rings falls sich Layout verzieht.)

### `addContacts.html` + `editContacts.html`
- `<form ... novalidate>`.
- Inputs: `required` raus, `onblur="validateContactField('name'|'email'|'phone')"` an.
- Phone-Error-Div einfügen.
- Deutsche Fehlermeldungen präzisieren.

### `js/contacts.js`
- `validateContactField(name)` — zeigt Meldung nur für dieses Feld.
- `validateContactForm()` erweitert um Phone.

## Verifikation

- Contacts @400px: Back-arrow sitzt ~65px vom oberen Rand (nicht mehr 50).
- Contacts @980px: Ellipse ist 84×84 (nicht mehr Base 100).
- Contacts @1200 & @1000 & @900: „Better with a team" in einer Zeile ohne Wrap.
- Signup: Name-Feld — beim ersten Tippen erscheint kein „Bitte gib deinen vollen Namen ein!"-Kasten. Erst nach Klick raus (blur) und wenn ungültig → Kasten. Weiter tippen zeigt/versteckt live.
- AddContact Desktop: Name-Input füllt visuell die volle Breite. Beim Absenden ohne Eingabe erscheint kein HTML5-Popup mehr; stattdessen rote Custom-Message unter Feld. Phone: „Bitte gültige Telefonnummer …" bei ungültiger Eingabe.
