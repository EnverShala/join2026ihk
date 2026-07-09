---
name: login-mobile-layout
status: complete
date: 2026-07-09
---

# Summary

## Changes

- `styles/loginResponsive.css` — rewrote the `@media (max-width: 600px)` block and refined the `@media (max-width: 600px) and (max-height: 730px)` block:
  - Logo pinned to top-left corner (`.logo-container { top: 20px; left: 20px }`), dropped the `.joinLogo { margin-top: -20px }` offset, small size (`50×42px`, `42×34px` on short screens).
  - Login card: `88dvw` (max 360px), padding `32px 20px 24px`, `h1` at `47px` (`40px` on short-height).
  - Divider narrower (`100px`).
  - Field inputs widened to 85% of card, tighter padding.
  - Removed the "Remember me" checkbox (`.checkbox_area { display: none }`).
  - Stacked action buttons: `.auth_buttons { flex-direction: column }` with matching 150×44 buttons.
  - Tightened the "Not a Join user? / Sign up" mobile row (`gap: 14px`), sign-up button trimmed to `10px 18px` padding, `15px` font.

## Notes

- `.d-none` on `.auth_options_mobile` still overrides at desktop breakpoints; the mobile media query wins in cascade because `loginResponsive.css` loads after `login.css`.
- Short-height mobiles (<=730px height) no longer clip content — replaced the `height: 70dvh` cap with `height: auto`.
