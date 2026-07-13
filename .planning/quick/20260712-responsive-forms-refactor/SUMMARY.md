---
name: Responsive Forms Refactor
description: Mobile no-scroll auth, phone-Zahlen-only, JS unter 400 Zeilen, kurze Required-Messages
status: complete
date: 2026-07-12
---

## Änderungen

### 1. Login/Signup Mobile ohne Scrolling
- `styles/loginResponsive.css`: `html/body { height: 100dvh; overflow: hidden }` auf ≤600px. Font-sizes, Buttons, Paddings verkleinert. Zusätzlicher Break bei max-height 700px.
- `styles/signup.css`: analog `overflow: hidden` auf mobile. `h1` Sign-Up-Schriftzug 61px → 36px (600px), 32px (400px), 30px (max-height 700px).

### 2. Input-Spacing für required messages
- `styles/login.css`: `.error_email_wrapper.d-none / .error_password_wrapper.d-none { display: block; visibility: hidden; }` — Platz bleibt reserviert. `.field_group-margin32` von 32px → 12px reduziert.
- `styles/signup.css`: `.requiredMessage { height: 20px; display: flex; align-items: center; }` und `.requiredMessage.d-none { display: flex !important; visibility: hidden; }` — konstante Höhe unabhängig vom sichtbar-Status. `input__box` margin überschrieben.

### 3. Phone-Feld nur Zahlen
- `addContacts.html`, `editContacts.html`: `<input inputmode="numeric" pattern="[0-9]*" onkeypress="return /[0-9]/.test(event.key)" oninput="filterPhoneInput(this); ...">`
- `js/contacts.js`: neue Funktion `filterPhoneInput(input)` (strippt non-digits). `CONTACT_PHONE_REGEX` von `/^[0-9\-+\s()]{6,16}$/` → `/^[0-9]{6,16}$/`. `editUserPopup` bereinigt vorhandene Legacy-Nummern beim Öffnen.

### 4. JS-Dateien unter 400 Zeilen
- `firebaseDatabaseFunctions.js`: 520 → 347 Zeilen (JSDoc kompakt, Guest-Sidebar-Link in `injectGuestLoginLink` extrahiert, `markActiveNavLink` extrahiert).
- `taskAttachments.js`: 453 → 314 Zeilen (JSDoc kompakt).
- `taskUIandBackend.js`: 439 → 278 Zeilen (JSDoc kompakt).

Alle sonstigen JS-Dateien liegen weiterhin ≤ 400 Zeilen (max: `board.js` mit 392).

### 5. Required-Messages kurz
- `signup.html`: "Please enter your full name!" → "Full name required", "Please enter a valid email address!" → "Valid email required", "Please enter a password with at least 6 characters!" → "Min. 6 characters", "The entered passwords don't match!" → "Passwords don't match".
- `addContacts.html`, `editContacts.html`: "Bitte einen Namen eingeben." → "Name erforderlich", "Bitte gültige E-Mail eingeben." → "Gültige E-Mail eingeben", "Bitte gültige Telefonnummer eingeben." → "Nur Zahlen, 6-16 Stellen".
- `board.html`, `task.html`: alle "This field is required" → "Required" (16 Stellen). Footer-Note: "*This field is required" → "*Required".
- `js/firebaseDatabaseFunctions.js`: "Please enter the required informations & accept the privacy policy." → "Bitte Pflichtfelder ausfüllen & Datenschutz akzeptieren."

### 6. JS-Formatierung
- Kein-Whitespace-am-Zeilenende in `boardPopup.js` und `firebaseUserRendering.js` bereinigt.
- Multi-Statement-Zeilen in `board.js`, `boardPopup.js`, `boardDialogs.js`, `sidebarHeader.js`, `firebaseUserRendering.js` in klare Einzelzeilen aufgeteilt.
- Ganze Datei-Indent (2 extra Spaces am Anfang) in `boardPopup.js`, `firebaseUserRendering.js`, `boardDialogs.js` entfernt.
- Kleinere Konsistenz-Fixes in `summary.js` (doppelte Zuweisung, Klammern).

## Test-Hinweise
- Login/Signup auf 375×667, 414×896, 360×640 prüfen: kein Scrollen, kein Layout-Shift bei Fehler-Meldungen.
- Add/Edit Contact: nur Ziffern-Eingabe (Tastatur + Paste testen).
- Board Add Task auf Desktop + Mobile: alle "Required"-Meldungen kurz.
- Bestehende Kontakte mit `+49 …` Nummern: beim Öffnen im Edit-Popup wird die Nummer auf Ziffern reduziert; Save überschreibt.
