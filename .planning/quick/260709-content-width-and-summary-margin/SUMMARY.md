---
name: content-width-and-summary-margin
status: complete
date: 2026-07-09
---

# Summary

## Changes

- `styles/sidebarHeader.css` — body: `margin: 0 auto; max-width: 1920px;` (covers all authenticated pages).
- `styles/login.css` — body: `margin: 0 auto; max-width: 1920px;`.
- `styles/signup.css` — body: `margin: 0 auto; max-width: 1920px;`.
- `styles/summary.css` — `.summary__container` at `@media (max-width: 800px)`: `margin-top: -20px` → `-100px`.

## Notes

- `sidebarHeader.css` is imported after each page's own stylesheet, so its body rules win in cascade — no per-page duplication needed.
- Fixed sidebar/mobile-nav remain viewport-anchored; on screens >1920px the body content centers while nav elements stay at the viewport edges.
- Preserved the separate `@media (min-height: 667px) and (max-height: 823px)` rule in `summary.css` (height-based, different intent).
