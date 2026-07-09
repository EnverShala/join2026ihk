---
slug: contacts-800-1140-fix
status: complete
completed: 2026-07-09
---

# Summary — Contacts responsiveness 800–1140px

## Root causes

1. **800px seam** — `sidebarHeader.css` triggers mobile mode at
   `max-width: 800px` while `contactsResponsive.css` used
   `max-width: 799px` and the JS used `>= 800` / `< 800`. At exactly 800px the
   sidebar disappeared but contacts stayed in desktop layout.
2. **Cramped 800–1140px** — the CSS collapsed the list to 225–240px in this
   range while the detail area kept its 400px header pinned via `left: 500px`
   / `left: 470px`; heading font drops to 42px but with `margin-right: -95px`
   creating an odd overlap with the vertical divider.
3. **Empty detail on shrink** — the resize handler unconditionally set
   `display: flex` on `#display-contact-headerID` in desktop mode. That inline
   style survived into mobile mode (inline > class selector), so shrinking
   the browser with no contact selected left the "Contacts / Better with a
   team" heading floating over the list.

## Changes

### `styles/contactsResponsive.css`
- Mobile block moved from `max-width: 799px` to `max-width: 800px` (aligned
  with the sidebar breakpoint).
- New `max-width: 1140px` block: list widened to 340px, add-button padding
  refreshed, detail repositioned to `left: 600px` with `right`-anchored
  sizing so it never overflows.
- `max-width: 1040px` rewritten around a 300px list.
- `max-width: 950px` rewritten with a 260px list, softened typography
  (h1 36px, ellipse 76px, contact name 26px), gap tuning, and
  `right`-anchored detail so it stays inside the viewport.
- Detail elements (`.contact-name-container`, `.contact-name`,
  `.contact-name-main-container`) switched to `width: auto` / `100%` in the
  smaller ranges so they honour the parent instead of overflowing.

### `js/firebaseUserRendering.js`
- Introduced `CONTACTS_MOBILE_MAX = 800` constant used by every layout gate.
- Replaced the previous resize handler with `applyContactsLayoutForWidth()`
  that reconciles layout against `currentUser`:
  - Desktop (> 800): clear inline styles, ensure list + detail visible.
  - Mobile with a contact selected: show detail, hide list, show back arrow.
  - Mobile with no contact: show list, hide detail (fixes the empty-detail
    ghost when shrinking the browser).
- `hideContactsListInResponsiveMode` and `showContactListAgainInResponsiveMode`
  updated to the new breakpoint.

## Files touched

- `styles/contactsResponsive.css`
- `js/firebaseUserRendering.js`

## Manual verification checklist

- [ ] At 800px viewport width the mobile layout is applied (no desktop
      sidebar gap).
- [ ] Widths 801–1140px: list is comfortably wide, add-button legible,
      "Contacts / Better with a team" heading fits without overlap.
- [ ] Shrinking browser <800px with no contact selected shows the list
      (not an empty detail area).
- [ ] Shrinking browser <800px with a contact selected shows the detail
      + back arrow.
- [ ] Growing browser back above 800px restores desktop layout.
