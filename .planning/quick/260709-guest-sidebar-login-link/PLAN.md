---
name: guest-sidebar-login-link
status: in-progress
date: 2026-07-09
---

# Quick Task: Guest sidebar for privacy/legal/help pages

## Scope

When a visitor is NOT logged in (no `loggedInAccount` and no `guestLoggedIn` flag) and views privacy/legalNotice/help:

- **Sidebar visible** with only:
  - Join logo at top
  - "Log In" link with an icon where the main-nav used to be
  - Footer nav (Privacy Policy, Legal notice) with the active page highlighted
- **No main-nav links** (Summary / Add Task / Board / Contacts) — hidden
- **No header icons** on the top-right (help button + profile/menu button hidden)
- **Mobile:** mobile-nav bottom bar hidden; profile-icon in mobile-header hidden

## Files

- `js/firebaseDatabaseFunctions.js` — rewrite `hideNavIfNotLoggedIn()` to restructure instead of hiding.
- `styles/sidebarHeader.css` — add `.login-sidebar-link` + `.nav-links-footer a.active` styles; remove the `body.no-sidebar` content-shift (obsolete).
- `help.html` — add `hideNavIfNotLoggedIn()` to `onload`.

## Notes

- Login icon is inline SVG (Feather `log-in`) — no new asset needed.
- Active-page detection uses `window.location.pathname` matched against the footer link `href`.
