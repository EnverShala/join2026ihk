# Join

Kanban-basierter Task-Manager, entwickelt im Rahmen des IHK-Zertifikat-Kurses der Developer Akademie. Join hilft Teams dabei, Aufgaben zu organisieren, Prioritäten zu setzen und den Fortschritt visuell zu verfolgen.

Live-Version: https://enver-shala.github.io/join2026ihk/ *(sofern GitHub Pages aktiviert)*

## Features

- **Board** – Kanban-Ansicht mit den Spalten *To Do*, *In Progress*, *Awaiting Feedback* und *Done*; Drag-and-Drop zwischen den Spalten.
- **Add Task** – Aufgaben mit Titel, Beschreibung, Fälligkeitsdatum, Kategorie, Priorität, zugewiesenen Kontakten, Subtasks und Bild-Anhängen anlegen.
- **Task-Detail-Popup** – Aufgaben ansehen, bearbeiten, Subtasks abhaken, Anhänge in einer Lightbox öffnen und herunterladen.
- **Contacts** – Kontakte anlegen, bearbeiten, löschen; alphabetisch gruppierte Liste mit Detailansicht.
- **Summary** – Übersicht mit Kennzahlen (Anzahl offener Tasks, dringliche Aufgaben, nächste Deadline etc.).
- **Auth** – Registrierung, Login und Gast-Zugang via Firebase.
- **Responsive** – Optimiert für Desktop, Tablet und Mobile.

## Tech-Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** [Firebase Realtime Database](https://firebase.google.com/) (REST API)
- **Hosting:** GitHub Pages oder beliebiger statischer Webserver

Keine Build-Toolchain, keine Frameworks. Alle Dateien werden direkt aus dem Repository ausgeliefert.

## Projektstruktur

```
join/
├── *.html                  # Einstiegsseiten (index, login, signup, board, contacts, summary, ...)
├── js/                     # JavaScript-Module
│   ├── board.js            # Board-Rendering und Drag-and-Drop
│   ├── boardDialogs.js     # Add-Task-Dialog / Edit-Dialog
│   ├── boardPopup.js       # Task-Detail-Popup
│   ├── contacts.js         # Kontakt-Logik
│   ├── firebaseDatabaseFunctions.js
│   ├── firebaseUserRendering.js
│   ├── login.js
│   ├── sidebarHeader.js
│   ├── signup.js
│   ├── summary.js
│   ├── task2.js / taskUIandBackend.js / taskBackendRest.js
│   ├── taskAttachments.js  # Bild-Uploads + Lightbox
│   └── templates.js        # HTML-Templates (Task-Karten, Kontakte, Lightbox, ...)
├── styles/                 # CSS-Dateien (getrennt nach Feature + Responsive)
├── img/                    # Icons, Logos, Illustrationen
├── design/                 # Design-Assets / Mockups
├── .planning/              # GSD-Workflow-Artefakte (interne Planung, nicht deploy-relevant)
├── favicon.ico
└── index.html              # Einstiegspunkt (Login)
```

## Einrichtung

### Voraussetzungen

- Ein aktueller Browser (Chrome, Firefox, Edge, Safari).
- Optional: lokaler Webserver, um CORS-Probleme beim Firebase-Zugriff und beim Nachladen der Skripte zu vermeiden.

### Lokale Ausführung

Ohne Server (schnellste Variante):

```bash
git clone https://github.com/EnverShala/join2026ihk.git
cd join2026ihk
# Datei index.html direkt im Browser öffnen
```

Mit lokalem Server (empfohlen):

```bash
# Python 3
python -m http.server 8000

# oder Node.js (http-server global installiert)
npx http-server -p 8000

# oder VS Code Live Server Extension
```

Anschließend im Browser aufrufen: <http://localhost:8000>

### Firebase-Konfiguration

Die Firebase-URL wird als Konstante `FIREBASE_URL` in `js/firebaseDatabaseFunctions.js` gesetzt. Für eine eigene Firebase-Instanz:

1. In der [Firebase Console](https://console.firebase.google.com/) ein Projekt mit Realtime Database anlegen.
2. Datenbank-Regeln für den lokalen Test auf offen setzen (nur zur Entwicklung – produktiv nicht empfohlen).
3. Die Datenbank-URL in `js/firebaseDatabaseFunctions.js` (`FIREBASE_URL`) hinterlegen.

## Nutzung

1. **Registrieren** – über `signup.html` einen Account anlegen (Name, E-Mail, Passwort ≥ 6 Zeichen, Datenschutz zustimmen).
2. **Login** – oder als *Guest* fortfahren.
3. **Board** – Tasks anlegen (`+ Add Task`), per Drag-and-Drop verschieben, öffnen zum Bearbeiten.
4. **Contacts** – Kontakte pflegen; diese können anschließend Tasks zugewiesen werden.
5. **Summary** – Statistik-Überblick der eigenen Tasks.

## Code-Konventionen

- JSDoc-Kommentare für öffentliche Funktionen.
- Templates leben zentral in `js/templates.js` und werden von Feature-Modulen konsumiert.
- CSS ist pro Feature getrennt (`feature.css` + `featureResponsive.css`).
- Funktionen bleiben kurz (≤ 14 Zeilen Code-Body, IHK-Richtwert).

## Mitwirken

Dieses Repository entsteht im Rahmen einer Ausbildung; PRs werden trotzdem gerne angenommen. Vor einem Beitrag:

1. Fork erstellen und Feature-Branch anlegen: `git checkout -b feature/neue-idee`.
2. Änderungen committen (aussagekräftige Commit-Messages, gerne Conventional Commits: `feat:`, `fix:`, `refactor:`, `style:` …).
3. Pull Request eröffnen.

## Autor

**Enver Shala** – Developer Akademie IHK-Zertifikat 2026

## Lizenz

Dieses Projekt entstand zu Ausbildungszwecken. Für die Nutzung außerhalb des Kurses bitte den Autor kontaktieren.
