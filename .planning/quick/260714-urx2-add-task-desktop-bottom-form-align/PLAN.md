---
type: quick-plan
slug: add-task-desktop-bottom-form-align
quick_id: 260714-urx2
created: 2026-07-14
status: in-progress
---

# Quick Task: Add-Task-Seite — bottom-form driftet bei ~2400px

## Beobachtung
Auf `task.html` in der Desktop-Ansicht (>1390px) verrutschen die beiden Buttons
(*Clear* / *Create Task*) und der `* Required`-Schriftzug bei sehr breiten
Viewports (~2400px) sichtbar gegen die Input-Spalten darüber.

## Ursache
`styles/addTask.css`:

```css
form {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  /* kein max-width */
}

.bottom-form {
  max-width: 976px;
  width: 100%;
  flex-basis: 100%;
}
```

- Das `form` streckt sich auf die volle Breite des `.taskContainer`
  (Viewport − 300px Sidebar-Margin). Bei 2400px = ~2100px.
- `.bottom-form` beansprucht per `flex-basis: 100%` und `width: 100%` die
  komplette Zeile und wird erst durch `max-width: 976px` geklammert.
- Der Flex-Algorithmus behandelt die Zeile mit einem hypothetischen 100%-Item;
  in Kombination mit `max-width` und großem Container entstehen Subpixel-
  und Row-Sizing-Effekte, die die `.bottom-form` gegenüber den Spalten
  verschieben.

## Fix
Base-Regel für `form` erhält `max-width: 1080px`. Damit hat das Form-Element
oberhalb der 1390px-Media-Query eine feste Obergrenze, die knapp über der
natürlichen Content-Row-Breite der Spalten (~1065px) liegt.

Effekt bei 2400px:
- `form` ist konstant 1080px breit.
- `.bottom-form` sitzt weiterhin auf 976px, links im Form.
- Layout ist identisch zu Ansichten bei 1600–2000px — kein Drift mehr.

## Nicht in scope
- Kein Bump von `.bottom-form { max-width }` oder Umbau auf `border-box` für
  Inputs. Das kleine Alignment-Delta zwischen Buttons und Spalten-Rand
  besteht bereits bei allen Desktop-Breiten und ist eine separate Design-Frage.
- Kein Umbau der Responsive-Breakpoints (max-width: 1390px, 800px, 576px,
  376px) — die überschreiben `form { width }` bzw. `.bottom-form { max-width }`
  ohnehin.
