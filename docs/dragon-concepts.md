# Dragon Background — Concepts & Implementation

**Context:** Dark web app, black background. Brand: primary `#0A74FF`, accent `#FFB400`. Goals: delight without distraction, accessibility, performance, graceful degradation on touch/keyboard.

---

## 1. Three integration concepts

| Concept | Name | One-line mood | Recommended placement |
|--------|------|----------------|------------------------|
| **A** | **Full-screen guardian** | “A calm presence that watches from the void.” | Full-screen background layer behind content; dragon head/silhouette at low opacity follows pointer from center with large dead zone. |
| **B** | **Corner vignette** | “A glimpse of scale in the corner of your eye.” | Fixed to one corner (e.g. bottom-right); dragon only enters frame when pointer nears that corner; rest of time hidden or very faint. |
| **C** | **Canvas layer** | “Floating in a layer between background and UI.” | Dedicated canvas (or SVG) between `background` and `main`; dragon follows with smoothing; can add parallax or glow that doesn’t affect layout. |

**Recommended:** **A (Full-screen background)** — most “living background” feel, works well with CSS variables + SVG and stays non-intrusive with opacity/distance rules.

---

## 2. Chosen concept: animation rules (Full-screen background)

- **Pointer follow:** Dragon head position is a smoothed (lerped) function of pointer position. Use CSS custom properties `--dragon-x`, `--dragon-y` (in % or px) updated from JS on a single RAF loop.
- **Easing and physics:** Lerp factor per frame (e.g. `current += (target - current) * 0.06`) for position; separate, slower lerp for rotation so the head eases toward pointer direction without snapping.
- **Distance thresholds:**
  - **Dead zone:** If pointer is within ~15% of viewport center, dragon doesn’t move (or moves very little) to avoid constant jitter when user is reading center content.
  - **Max follow distance:** Cap how far the dragon can move from center (e.g. 30% of viewport) so it stays “in the background.”
- **Opacity and glow:**
  - Base opacity low (e.g. 0.12–0.18); reduce further (e.g. 0.06) when pointer is over interactive elements (buttons, modals, links) so the dragon doesn’t compete with tasks.
  - Glow: CSS `filter: drop-shadow()` or a soft SVG filter using primary `#0A74FF`; optional subtle accent `#FFB400` on eye or detail. Keep blur large and opacity low so it’s ambient, not a spotlight.
- **Reaction to interactive elements:** On `mouseenter` of `a, button, [role="button"], [data-modal]`, set a data attribute or class on `<html>` (e.g. `data-dragon-dimmed`); CSS reduces dragon opacity. On `mouseleave`, remove it. No extra animation needed—instant dim is enough.

---

## 3. Implementation options

| Option | Pros | Cons | Dev effort | Performance risk |
|--------|------|------|------------|-------------------|
| **Sprite sheet on canvas** | Full control, can do frame animation (blink, breath). | More code (load image, draw frame, clear); DPI/retina handling. | Medium | Low–medium (one canvas, one draw per frame). |
| **SVG + JS transforms** | Scalable, small DOM, style with CSS (fill, filter). Easy to swap in Lottie later by replacing SVG with Lottie container. | No built-in frame animation (use CSS animation for blink if needed). | **Low** | **Low** (transform/opacity only, no pixels). |
| **Lottie player** | Rich animation (blink, breath) with small JSON. | Extra dependency, JSON size, Lottie’s own RAF. | Medium | Low (if one instance, no heavy assets). |
| **WebGL shader** | Best for particles, fog, complex glow. | Overkill for one dragon; harder to maintain; battery impact on mobile. | High | Medium (GPU). |

**Recommended for “recent CSS” and minimal footprint:** **SVG + JS transforms** — position/rotate via CSS variables, glow with CSS `filter`, one RAF loop. Mark in code where to swap in Lottie or sprite if you add frame animation later.

---

## 4. Copy-paste ready code (minimal, performant)

- **Approach:** One background layer (fixed, full-screen, `z-index` below content). Inline SVG dragon (single path or group); position/rotation via CSS custom properties; one `mousemove` listener + one RAF loop; smoothing and dead zone in JS.
- **Swap points:**  
  - Replace inner SVG with `<div id="dragon-lottie" />` and init Lottie to that node, or  
  - Replace SVG with `<canvas id="dragon-canvas" />` and draw sprite frames in the same RAF using `--dragon-x`, `--dragon-y`, `--dragon-rotate`.

See **Implementation** section below for the actual component and CSS.

---

## 5. Accessibility and performance checklist

- [ ] **Keyboard parity:** Dragon is decorative only; no interactive element depends on it. Focus order and `:focus-visible` unchanged. No keyboard-triggered dragon motion required.
- [ ] **prefers-reduced-motion:** When `(prefers-reduced-motion: reduce)`, do not run the pointer-follow script; show a static dragon (or hide it). Use a media query or JS check and skip RAF + mousemove.
- [ ] **Touch fallback:** When `(hover: none)`, do not run pointer follow; hide dragon or show a static, low-opacity version so touch users get a calm background without motion.
- [ ] **Low-power / battery:** Optional: use `navigator.getBattery?.()` or reduce motion after N seconds of no movement to throttle RAF (e.g. 1 update per 100ms) or pause.
- [ ] **Frame-rate:** In dev, optional FPS counter; in prod, consider a single metric (e.g. “dragon RAF dropped below 30fps for >1s”) and log or send once. No continuous monitoring required for MVP.
- [ ] **Contrast:** Dragon is background decoration; ensure main UI still meets WCAG AA against black. Dragon opacity kept low so it doesn’t become foreground content.

---

## 6. Testing and measurement plan

- **Metrics to track (optional but useful):**
  - **CLS:** Ensure dragon layer doesn’t shift layout (fixed, no reserved space); CLS should stay 0 from dragon.
  - **Input latency:** Measure time from `mousemove` to next paint; keep smoothing lerp light so latency stays &lt; 50ms.
  - **FPS:** Sample `requestAnimationFrame` delta during dragon updates; flag if sustained &lt; 30fps (e.g. on low-end devices).
- **A/B test ideas:**
  - **Delight vs distraction:** Variant A = dragon on, Variant B = dragon off. Measure task completion, time-on-task, and optional survey (“Did the background feel pleasant or distracting?”).
  - **Intensity:** Variant A = current opacity, Variant B = 50% opacity. Compare engagement and perceived performance.

---

## Implementation in this project

- **Component:** `src/components/DragonBackground.tsx` — enables only when `(hover: hover)` and not `(prefers-reduced-motion: reduce)`; single `mousemove` + one RAF; updates `--dragon-x`, `--dragon-y`, `--dragon-rotate`, `--dragon-opacity`; listens for interactive hover to dim.
- **Styles:** `src/app/globals.css` — `.dragon-layer`, `.dragon-svg`, use of `var(--dragon-x)`, `var(--dragon-y)`, `var(--dragon-rotate)`, `var(--dragon-opacity)` and optional `var(--dragon-glow)`; `data-dragon-dimmed` for interactive hover.
- **Brand:** Dragon uses `--dragon-primary: #0A74FF` and `--dragon-accent: #FFB400` in the dragon layer scope so the rest of the app can keep existing `--primary` / `--accent` for LUMEN if needed.
