---
name: guest-sidebar-login-link
status: complete
date: 2026-07-09
---

# Summary

## Changes

- `js/firebaseDatabaseFunctions.js` — `hideNavIfNotLoggedIn()` rewritten. Instead of hiding the sidebar entirely, it:
  - Adds `body.guest-view`.
  - Removes `.menu-sidebar` (Summary/Add Task/Board/Contacts).
  - Injects a `.login-sidebar-link` with inline SVG login icon linking to `login.html`.
  - Hides `.desktop-header .header-icons` (help + profile menu).
  - Hides `.mobile-header .profile-icon` and `.mobile-nav`.
  - Adds `.active` to the footer nav link matching the current page.

- `styles/sidebarHeader.css` — Replaced the obsolete `body.no-sidebar` content-shift with styles for:
  - `.login-sidebar-link` + `.login-sidebar-icon` (guest login link + icon).
  - `.nav-links-footer a.active` (dark highlighted background on active footer link).

- `help.html` — `onload` now also calls `hideNavIfNotLoggedIn()` so help matches privacy/legalNotice behavior for guests.

## Notes

- The login icon is an inline SVG (Feather `log-in` style) — no new asset added.
- Active-page detection uses `window.location.pathname.split("/").pop()` matched against footer link `href` (case-insensitive).
- privacy.html and legalNotice.html already had `hideNavIfNotLoggedIn()` wired into `onload`.
