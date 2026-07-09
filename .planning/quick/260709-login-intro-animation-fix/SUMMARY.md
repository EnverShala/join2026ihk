---
name: login-intro-animation-fix
status: complete
date: 2026-07-09
---

# Summary

## Changes

- `styles/login.css` — `.start` transform: `scale(3)` → `translate(-50%, -50%) scale(3)`, and selector bumped to `.logo-container.start` (specificity 0,2,0).

## Why the specificity bump was needed

`loginResponsive.css` loads after `login.css`, and its mobile block contains:

```css
@media (max-width: 600px) {
  .logo-container { top: 20px; left: 20px; }
}
```

Both `.start` (single class) and `.logo-container` (single class) have specificity (0,1,0). At equal specificity, the later rule wins — so on mobile the resting position was overriding the animation start state. The logo appeared in the corner from frame 1 and never animated.

Bumping the selector to `.logo-container.start` (specificity 0,2,0) beats any single-class `.logo-container` rule regardless of source order, so the start state applies on desktop and mobile.

## Result

Logo now paints centered at 3× scale on load, then transitions (`transition: all 1.3s ease-in-out`) into `top: 20px; left: 20px; transform: none` on mobile (or `50px/50px` on desktop) when `init()` removes `.start`.
