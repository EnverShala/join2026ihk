---
slug: contacts-800-1140-fix
created: 2026-07-09
---

# Quick Task: Contacts responsiveness 800–1140px + 800px sidebar seam

Fix three related issues with the Contacts page:

1. **800px seam**: `sidebarHeader.css` switches to mobile at `max-width: 800px`
   while `contactsResponsive.css` uses `max-width: 799px`. At exactly 800px the
   sidebar disappears but the contacts layout still assumes desktop → broken.

2. **Cramped 800–1140px range**: List gets very narrow (225–370px), detail
   headings/positioning look unpolished.

3. **Empty detail on shrink**: When no contact is selected and the browser is
   resized below the mobile breakpoint, the resize handler leaves the header
   pinned via inline `display: flex` — user sees the empty "Contacts / Better
   with a team" heading instead of the contact list.

## Approach

- **CSS**: shift the `max-width: 799px` block to `max-width: 800px` (so it
  activates at the same point the sidebar goes mobile). Add a fresh
  `max-width: 1140px` block, restructure the existing 1040 and 950 blocks so
  the list is wider (~300–340px), detail positioning stays clear of the list,
  and typography scales sensibly.
- **JS (`firebaseUserRendering.js`)**: consolidate resize + mode-switch into a
  single `applyContactsLayoutForWidth()` helper called on resize and after
  each user selection. It reads `currentUser` to decide whether the mobile
  layout should show the list or the detail. Update inline breakpoints (800
  becomes the mobile-mode threshold everywhere).

## Files touched

- `styles/contactsResponsive.css`
- `js/firebaseUserRendering.js`
