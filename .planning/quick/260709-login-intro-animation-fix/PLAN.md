---
name: login-intro-animation-fix
status: complete
date: 2026-07-09
---

# Quick Task: Fix intro logo animation centering

## Problem

On mobile, the logo intro animation starts off-center: `.start { top: 50%; left: 50%; transform: scale(3) }` places the container's top-left corner at viewport center, not the logo's own center. `scale(3)` then enlarges around the logo's mid-point, producing a visibly offset "start" position — hardly noticeable on wide desktop viewports, but obvious on narrow phones.

## Fix

Add `translate(-50%, -50%)` to the transform in `.start` so the logo's own center sits at the viewport center before scaling. `.transition2s { transition: all 1.3s ease-in-out }` interpolates cleanly from `translate(-50%, -50%) scale(3)` → `none`, so the logo now shrinks from the true center and slides into the top-left corner.

## File

- `styles/login.css` — one-line change in the `.start` rule.
