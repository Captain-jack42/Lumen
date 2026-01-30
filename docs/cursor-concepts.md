# Cursor Micro-Interactions — Concepts & Implementation

**Brand:** Primary `#0D0D12`, Secondary `#1A1A24`, Accent `#C9A962`, Neutral `#8B8B9A`, Highlight `#F0EBE3`  
**Font:** Syne (display), DM Sans (body)  
**Constraints:** WCAG AA, low bandwidth (minimal JS, no heavy assets)

---

## Concept 1: Dot + Ring (Recommended)

**Idea:** A small dot follows the cursor; a ring lags slightly behind. On interactive elements (links, buttons), the ring scales up and uses the accent color. Feels premium and lightweight.

**Pros:** Low bandwidth (CSS + ~1KB JS), smooth, on-brand.  
**Cons:** Requires pointer (no effect on touch).

### CSS

```css
/* Only when custom cursor is active (class on html) */
html.cursor-custom {
  cursor: none;
}

html.cursor-custom * {
  cursor: none;
}

/* Respect reduced motion: no custom cursor */
@media (prefers-reduced-motion: reduce) {
  html.cursor-custom,
  html.cursor-custom * {
    cursor: auto;
  }
}

/* Fallback: touch devices don't get custom cursor */
@media (hover: none) {
  html.cursor-custom,
  html.cursor-custom * {
    cursor: auto;
  }
}
```

### JS (snippet)

```js
// Use requestAnimationFrame, single listener, CSS variables for position
let x = 0, y = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  x = e.clientX;
  y = e.clientY;
});

function tick() {
  ringX += (x - ringX) * 0.15;
  ringY += (y - ringY) * 0.15;
  document.documentElement.style.setProperty('--cursor-x', `${x}px`);
  document.documentElement.style.setProperty('--cursor-y', `${y}px`);
  document.documentElement.style.setProperty('--cursor-ring-x', `${ringX}px`);
  document.documentElement.style.setProperty('--cursor-ring-y', `${ringY}px`);
  requestAnimationFrame(tick);
}
tick();
```

### Accessibility fallbacks

- **prefers-reduced-motion: reduce** → Do not apply `cursor: none`; use default cursor. Do not mount custom cursor DOM/JS.
- **hover: none** (touch) → Do not apply custom cursor; native cursor/touch remains.
- **Keyboard / focus** → Focus rings remain visible (outline); custom cursor is visual only and does not affect focus order.
- **High contrast** → Rely on system cursor when user prefers high contrast if needed (optional media query).

---

## Concept 2: Glow Trail

**Idea:** Cursor is a soft glow (accent color) that leaves a short, fading trail. Implemented with a small number of trailing divs and CSS opacity/transform.

**Pros:** Distinct, memorable.  
**Cons:** Slightly more DOM/JS; ensure trail is subtle to avoid distraction (WCAG).

### CSS

```css
.cursor-glow {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  z-index: 9999;
  opacity: 0.9;
}

.cursor-glow span {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 98, 0.4);
  transform: translate(-50%, -50%);
}
```

### JS (snippet)

```js
// Only enable if pointer and not reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = window.matchMedia('(hover: hover)').matches;
if (prefersReducedMotion || !hasHover) return;

// Small trail: e.g. 3 elements, update positions in a ring buffer
const trail = []; // push new pos, shift old
function move(x, y) {
  trail.push({ x, y });
  if (trail.length > 3) trail.shift();
  trail.forEach((p, i) => {
    const el = trailEls[i];
    if (el) {
      el.style.left = p.x + 'px';
      el.style.top = p.y + 'px';
      el.style.opacity = 0.3 + (i / trail.length) * 0.6;
    }
  });
}
```

### Accessibility fallbacks

- Same as Concept 1: **prefers-reduced-motion** and **hover: none** → skip custom cursor entirely.
- Keep trail opacity and size modest so it doesn’t dominate the screen (AAA consideration).

---

## Concept 3: Magnetic Hint

**Idea:** Default cursor is a small dot; when it gets close to a CTA or link, a subtle “magnetic” pull or scale effect on the cursor (e.g. ring grows and shifts slightly toward the element). No actual movement of the page—only the cursor visual.

**Pros:** Delightful, reinforces interactivity.  
**Cons:** Slightly more logic (distance to interactive elements); must stay subtle for WCAG.

### CSS

```css
.cursor-magnetic .cursor-ring {
  transition: transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
}

.cursor-magnetic .cursor-ring.is-near {
  width: 48px;
  height: 48px;
  border-color: var(--accent);
  background: rgba(201, 169, 98, 0.08);
}
```

### JS (snippet)

```js
const interactive = document.querySelectorAll('a, button, [role="button"]');
let near = false;

function updateRing(e) {
  const ring = document.getElementById('cursor-ring');
  let minD = 80;
  interactive.forEach((el) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    if (d < minD) { minD = d; near = true; }
  });
  near = minD < 80;
  ring.classList.toggle('is-near', near);
}
```

### Accessibility fallbacks

- **prefers-reduced-motion** → No magnetic effect; ring stays default size/position or custom cursor disabled.
- **hover: none** → Do not enable custom cursor.
- Ensure focus indicators on `a` and `button` are always visible (e.g. `:focus-visible` outline).

---

## Prioritized Implementation Plan

| Phase | Task | Effort | Impact |
|-------|------|--------|--------|
| **1** | Implement **Concept 1 (Dot + Ring)** with brand colors (dot: highlight, ring: accent on hover). | Small | High |
| **2** | Add **accessibility**: `prefers-reduced-motion` and `hover: none` checks; do not add `cursor: none` or cursor DOM when disabled. | Small | Required |
| **3** | Add **interactive states**: data attribute or class on `a`, `button`; ring scales and uses accent when over them. | Small | High |
| **4** | (Optional) Add **Concept 2** as theme/variant or A/B test. | Medium | Medium |
| **5** | (Optional) Add **Concept 3** magnetic hint on primary CTAs only. | Medium | Medium |

**Low-bandwidth notes:**

- Use CSS variables for cursor position (one RAF loop, no layout thrashing).
- Single `mousemove` listener; no extra assets.
- Custom cursor DOM: one dot + one ring (2 elements).

---

## WCAG AA Checklist

- [ ] Custom cursor does not replace or hide focus indicators (`:focus-visible` remains).
- [ ] No information conveyed by cursor alone (cursor is enhancement only).
- [ ] Motion respects `prefers-reduced-motion: reduce`.
- [ ] Touch users get default behavior (no broken cursor on tap).
- [ ] Contrast: cursor dot/ring meet 3:1 against typical backgrounds (e.g. highlight/primary, accent/primary).

---

---

## Implementation in This Project

**Concept 1 (Dot + Ring)** is implemented with the above fallbacks and brand colors.

- **Component:** `src/components/CustomCursor.tsx` — enables only when `(hover: hover)` and not `(prefers-reduced-motion: reduce)`; single `mousemove` + RAF; toggles `cursor-hover` on interactive elements.
- **Styles:** `src/app/globals.css` — `.cursor-dot`, `.cursor-ring`, `html.cursor-custom`, `html.cursor-hover`, and `@media (prefers-reduced-motion: reduce)` / `@media (hover: none)` fallbacks.
- **Usage:** Rendered in `src/app/page.tsx`; no props. Add `data-cursor-interactive` to any element to get the ring hover state.
