---
name: login-mobile-layout
status: in-progress
date: 2026-07-09
---

# Quick Task: Login page mobile layout to match screenshot

## Scope

Match the login page mobile layout to the provided screenshot at max-width 600px.

## Deltas vs. current

1. **"Remember me" checkbox** — visible currently, absent in target → hide via `display: none`.
2. **Login/Guest buttons** — currently side-by-side (`flex-direction: row`) → stacked vertically, centered, ~140px wide.
3. **Login card h1** — currently width: 315px, font-size: 61px (overflows narrow cards) → auto width, ~47px font-size, tighter card padding.
4. **Input width** — currently 70% of card → wider (~85%) so inputs feel like the screenshot.
5. **Logo** — currently `.joinLogo { margin-top: -20px }` (weird offset) → drop negative margin; `.logo-container` at top-left corner (~20px from top and left).
6. **auth_options_mobile row** — currently gap 30px → tighter (~12px) with matching sign-up button padding, keeping it centered as one row.

## File

`styles/loginResponsive.css` — modify the `@media (max-width: 600px)` block.
