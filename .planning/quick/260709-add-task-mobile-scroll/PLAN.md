---
name: add-task-mobile-scroll
status: complete
date: 2026-07-09
---

# Quick Task: Mobile Add Task scroll + sticky action bar

## Target layout (from screenshot)

- `mobile-header` at top (60px, in flow)
- "Add Task" title stays visible under the header
- Input fields (Title/Description/Due date/Priority/Assigned to/Category/Subtasks/Anhänge) scroll independently
- `.bottom-form` (required-note + Clear + Create Task buttons) pinned at the bottom of the container — always visible
- `mobile-nav` (96px) at the very bottom of viewport

## Implementation

At `@media (max-width: 800px)`:
- `body { height: 100dvh; overflow: hidden }` — lock viewport scroll.
- `.taskContainer { position: fixed; top: 60px; bottom: 96px; left: 0; right: 0 }` — the container fills the strip between mobile-header (60px) and mobile-nav (96px).
- Inside, flex-column: `.header` (flex-shrink: 0), `form` (flex: 1; overflow-y: auto), `.bottom-form` (flex-shrink: 0).
- Scoped width overrides (`.taskContainer form` etc.) so inputs and columns stretch to the container width.

## Cascade cleanup

Existing `@media (max-width: 576px)` and `@media (max-width: 376px)` blocks used unqualified `form { width: 330px !important }` / `280px !important`. Replaced with `.taskContainer`-prefixed selectors (higher specificity, wins with same `!important`) that force `100%` — so the form fills the fixed container regardless of viewport width. Also removed the `.bottom-form { margin-bottom: 150px }` hack at 376px which existed to push above the old mobile-nav.

## File

- `styles/addTaskResponsive.css`
