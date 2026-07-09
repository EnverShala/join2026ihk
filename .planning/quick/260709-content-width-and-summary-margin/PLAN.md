---
name: content-width-and-summary-margin
status: in-progress
date: 2026-07-09
---

# Quick Task: Content width limit + summary margin adjustment

## Scope

1. Cap page content at 1920px width across the app (centered on ultra-wide screens).
2. Update `.summary__container` `@media (max-width: 800px)` block: `margin-top: -20px` → `margin-top: -100px`.

## Files to change

- `styles/sidebarHeader.css` — body max-width 1920px, margin: 0 auto (covers all authenticated pages via shared stylesheet).
- `styles/login.css` — body max-width 1920px, margin: 0 auto.
- `styles/signup.css` — body max-width 1920px, margin: 0 auto.
- `styles/summary.css` — change margin-top in the 800px breakpoint block.

## Approach

`sidebarHeader.css` is loaded on every authenticated page and is included after each page's own stylesheet, so its `body` declarations win via cascade. Adding the width cap there avoids touching each page's individual CSS. `login.css` and `signup.css` are standalone and need direct edits.

Fixed sidebar/header (`position: fixed; left: 0`) remain viewport-anchored; on screens wider than 1920px the body content centers while nav stays at the viewport edge — acceptable tradeoff for a global content cap.
