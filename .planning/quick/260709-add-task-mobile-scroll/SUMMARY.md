---
name: add-task-mobile-scroll
status: complete
date: 2026-07-09
---

# Summary

## Change

- `styles/addTaskResponsive.css` — reworked the `@media (max-width: 800px)` block and re-scoped the `576px` / `376px` width overrides.

## Key rules added at ≤800px

- `body { height: 100dvh; overflow: hidden }` — no page scroll.
- `.taskContainer { position: fixed; top: 60px; bottom: 96px; left: 0; right: 0; display: flex; flex-direction: column }` — occupies the strip between mobile-header and mobile-nav.
- `.taskContainer form { flex: 1; min-height: 0; overflow-y: auto }` — inner scroll for the fields.
- `.taskContainer .bottom-form { flex-shrink: 0; padding: 12px 0; border-top: 1px solid rgba(0,0,0,.08) }` — sticky action bar with the required-note + Clear/Create buttons.
- Inputs, `.addTaskLeft`, `.col-right`, `.buttons-prio` → `width: 100%; box-sizing: border-box` so everything stretches.

## Cascade fixes at ≤576px / ≤376px

- Replaced unqualified `form { width: 330px !important }` / `280px !important` with `.taskContainer form` (higher specificity, wins with same `!important`), forcing 100% inside the fixed container.
- Removed `.bottom-form { margin-bottom: 150px }` push-up hack at 376px — no longer needed with the pinned bottom.

## Notes

- Uses `100dvh` (dynamic viewport height) so iOS Safari's URL bar changes don't clip the pinned bar.
- `-webkit-overflow-scrolling: touch` for smoother iOS scrolling inside the form.
