---
name: add-task-scroll-and-cap-fix
status: complete
date: 2026-07-09
---

# Summary

## Iteration 2 fixes (based on user screenshot)

### Problem 1: "Add Task" title clipped by mobile-header

`.mobile-header` on mobile has `height: 60px` (content-box) + `padding: 1em` (16px top + bottom) → total container height = **92px**, but I had `taskContainer { position: fixed; top: 60px }`. The overlap was 32px, and the title's top was hidden behind the header.

**Fix:** Ditched the hard-coded `top: 60px` altogether. Switched `body.task-page` to a flex column so `mobile-header` occupies its natural height and `taskContainer` (`flex: 1; min-height: 0`) fills the rest. No more magic numbers.

### Problem 2: gap between sticky action bar and mobile-nav

Sticky bar had `padding: 12px 0` — buttons ended 12px above sticky bottom, and sticky bottom was already at mobile-nav's top. Result: 12px visual gap between buttons and nav.

Also, since the container is no longer `position: fixed; bottom: 96px`, the scroll parent now extends to the viewport bottom, so `sticky bottom: 0` would put the bar under the mobile-nav overlay. Needed `sticky bottom: 96px`.

**Fix:** `.bottom-form { position: sticky; bottom: 96px; padding: 12px 16px 0 }` — sticks 96px above the scroll parent bottom (= mobile-nav's top edge), and `padding-bottom: 0` so the buttons themselves touch the mobile-nav.

## Full changed rules in `addTaskResponsive.css` @ max-width: 800px

```css
body.task-page {
  height: 100dvh;
  margin: 0;
  max-width: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

body.task-page .mobile-header { flex-shrink: 0; }

body.task-page .taskContainer {
  flex: 1 1 auto;
  min-height: 0;
  padding: 12px 16px 0;
  overflow-y: auto;
  overflow-x: hidden;
  ...
}

body.task-page .taskContainer .bottom-form {
  position: sticky;
  bottom: 96px;
  width: calc(100% + 32px);
  margin: 12px -16px 0;
  padding: 12px 16px 0;
  background-color: #f6f7f8;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 5;
}
```

The `width: calc(100% + 32px)` with `margin: 12px -16px 0` breaks the sticky bar out of the container's 16px horizontal padding so the border-top and background span the full width.
