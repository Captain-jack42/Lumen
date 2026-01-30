# Dragon Background — Pointer vs Ambient Modes

**App:** [AppName] (LUMEN). **Goal:** Pointer-following dragon that degrades to an always-in-motion ambient dragon when pointer tracking fails. Suited to current CSS (variables, keyframes, no heavy deps).

---

## 1) Pointer and ambient behavior specs

### Pointer mode (when tracking works)

- **Trigger:** `(hover: hover)` and not `(prefers-reduced-motion: reduce)` and no fallback triggered.
- **Behavior:** Dragon position/rotation driven by mouse. Smooth lerp (e.g. 0.06 position, 0.04 rotation). Dead zone ~15% from center; max radius ~28%. Opacity 0.14 default; 0.06 over interactive elements.
- **Update:** One `mousemove` listener + one RAF loop; write `--dragon-x`, `--dragon-y`, `--dragon-rotate`, `--dragon-opacity` to CSS vars.

### Ambient mode (when pointer tracking fails or is unavailable)

- **Trigger:** Touch (`hover: none`), low FPS, JS error in pointer loop, or explicit fallback.
- **Behavior:** Dragon always in motion. **Pure CSS** animation: gentle drift (e.g. oval or figure-8 path) with `transform: translate(...)` and optional slow `rotate`. No JS for position; one keyframes animation (e.g. `dragon-float` 20–30s `ease-in-out` infinite). Opacity fixed (e.g. 0.12) or slightly pulsed via keyframes.
- **Update:** No RAF for position. Class `dragon-layer--ambient` on container; `.dragon-svg--ambient` uses `animation: dragon-float ...`.

---

## 2) Auto-switch detection logic

| Condition | Action | Reason |
|-----------|--------|--------|
| `(prefers-reduced-motion: reduce)` | **Hidden** — do not mount dragon. | No motion. |
| `(hover: none)` | **Ambient** — mount with `dragon-layer--ambient`, no pointer logic. | Touch; no reliable pointer. |
| Pointer mode active | Run RAF + mousemove. | Normal desktop. |
| **Low FPS** (e.g. avg frame delta > 50ms over last 10 frames) | Switch to **Ambient**; stop RAF; add ambient class. | Avoid jank; degrade gracefully. |
| **JS error** in `tick()` or mousemove | Catch, switch to **Ambient**; stop RAF; add ambient class. | Robustness. |
| Lazy load | Mount dragon layer only after `requestIdleCallback` or `setTimeout(200)` so initial paint is not blocked. | Performance. |

**Order of checks (on mount):**

1. If `prefers-reduced-motion` → hidden (return null).
2. If `hover: none` → ambient (render with `--ambient`, no pointer listeners).
3. Else → pointer mode (start RAF + mousemove). If low FPS or error → switch to ambient once.

---

## 3) Copy-paste vanilla JS and CSS (concept)

Standalone pattern (no React). Same logic can be used in a script tag or separate JS file.

### CSS (snippet)

```css
.dragon-layer {
  --dragon-primary: #0A74FF;
  --dragon-accent: #FFB400;
  --dragon-x: 50%;
  --dragon-y: 50%;
  --dragon-rotate: 0deg;
  --dragon-opacity: 0.14;
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}

.dragon-svg {
  position: absolute;
  left: var(--dragon-x); top: var(--dragon-y);
  width: min(280px, 40vw); height: auto;
  transform: translate(-50%, -50%) rotate(var(--dragon-rotate));
  opacity: var(--dragon-opacity);
  will-change: left, top, transform;
}

/* Ambient: always-in-motion (pure CSS) */
.dragon-layer--ambient .dragon-svg {
  left: 50%; top: 50%;
  animation: dragon-float 25s ease-in-out infinite;
  opacity: 0.12;
}

@keyframes dragon-float {
  0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(-5deg); }
  25%      { transform: translate(-50%, -50%) translate(4%, 3%) rotate(2deg); }
  50%      { transform: translate(-50%, -50%) translate(-3%, 4%) rotate(5deg); }
  75%      { transform: translate(-50%, -50%) translate(3%, -2%) rotate(-2deg); }
}
```

### JS (snippet — detection + mode switch)

```js
function getDragonMode() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'hidden';
  if (window.matchMedia('(hover: none)').matches) return 'ambient';
  return 'pointer';
}

function initDragon() {
  const mode = getDragonMode();
  if (mode === 'hidden') return;

  const layer = document.getElementById('dragon-layer');
  const svg = layer.querySelector('.dragon-svg');

  if (mode === 'ambient') {
    layer.classList.add('dragon-layer--ambient');
    svg.classList.add('dragon-svg--ambient');
    return;
  }

  let rafId;
  const state = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, rotate: 0, targetRotate: 0 };
  const LERP = 0.06;
  const lastFrames = [];
  const FPS_THRESHOLD_MS = 50;
  const FPS_SAMPLE = 10;

  function tick(now) {
    lastFrames.push(now);
    if (lastFrames.length > FPS_SAMPLE) lastFrames.shift();
    const avgDelta = lastFrames.length >= 2 ? (lastFrames[lastFrames.length - 1] - lastFrames[0]) / (lastFrames.length - 1) : 0;
    if (avgDelta > FPS_THRESHOLD_MS && lastFrames.length >= FPS_SAMPLE) {
      layer.classList.add('dragon-layer--ambient');
      svg.classList.add('dragon-svg--ambient');
      cancelAnimationFrame(rafId);
      return;
    }

    try {
      state.x += (state.targetX - state.x) * LERP;
      state.y += (state.targetY - state.y) * LERP;
      state.rotate += (state.targetRotate - state.rotate) * 0.04;
      document.documentElement.style.setProperty('--dragon-x', state.x * 100 + '%');
      document.documentElement.style.setProperty('--dragon-y', state.y * 100 + '%');
      document.documentElement.style.setProperty('--dragon-rotate', state.rotate + 'deg');
    } catch (e) {
      layer.classList.add('dragon-layer--ambient');
      svg.classList.add('dragon-svg--ambient');
      cancelAnimationFrame(rafId);
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', function(e) {
    const w = window.innerWidth, h = window.innerHeight;
    const dx = e.clientX / w - 0.5, dy = e.clientY / h - 0.5;
    const dist = Math.hypot(dx, dy);
    const dead = 0.15, maxR = 0.28;
    if (dist < dead) { state.targetX = 0.5; state.targetY = 0.5; state.targetRotate = 0; }
    else {
      const r = Math.min(dist, maxR), scale = r / dist;
      state.targetX = 0.5 + dx * scale; state.targetY = 0.5 + dy * scale;
      state.targetRotate = Math.atan2(dy, dx) * 180 / Math.PI;
    }
  }, { passive: true });

  rafId = requestAnimationFrame(tick);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function() {
  requestIdleCallback ? requestIdleCallback(function() { initDragon(); }, { timeout: 400 }) : setTimeout(initDragon, 200);
}); else {
  requestIdleCallback ? requestIdleCallback(function() { initDragon(); }, { timeout: 400 }) : setTimeout(initDragon, 200);
}
```

**Lazy load:** Call `initDragon()` inside `requestIdleCallback` (with timeout) or `setTimeout(..., 200)` so the dragon mounts after initial paint. Mark where to swap in Lottie or sprite: replace the inner HTML of `#dragon-layer` with a Lottie container or canvas and run the same mode logic.

---

## 4) Accessibility and performance checklist

- [ ] **Keyboard:** Dragon is decorative only; no focus or keyboard interaction.
- [ ] **prefers-reduced-motion:** Dragon not mounted; no motion.
- [ ] **Touch:** Ambient mode only; no pointer tracking; CSS-only motion.
- [ ] **Low FPS:** After N frames with avg delta > 50ms, switch to ambient (CSS animation only).
- [ ] **JS errors:** try/catch in tick(); on error switch to ambient.
- [ ] **Lazy load:** Mount dragon after idle or short delay to avoid blocking first paint.
- [ ] **CLS:** Dragon layer is fixed, no reserved layout space; CLS unaffected.
- [ ] **No layout thrashing:** Only CSS vars and class toggles; no reads in RAF that force layout.

---

## 5) Implementation plan with dev hours

| Step | Task | Hours |
|------|------|------|
| 1 | Spec pointer vs ambient behavior and detection rules (this doc). | 0.5 |
| 2 | Add ambient CSS (keyframes `dragon-float`, `.dragon-layer--ambient`). | 0.5 |
| 3 | Refactor component: mode state (pointer | ambient | hidden), detection on mount, lazy mount. | 1 |
| 4 | Pointer loop: add FPS sampling and switch to ambient on low FPS; try/catch and switch on error. | 0.5 |
| 5 | Lazy load: mount dragon after requestIdleCallback or setTimeout. | 0.25 |
| 6 | Test: desktop (pointer), touch (ambient), reduced-motion (hidden), throttle CPU (low FPS → ambient). | 0.75 |
| **Total** | | **~3.5 h** |

---

**Implementation in this project:** `src/components/DragonBackground.tsx` and `src/app/globals.css` implement the above. Dragon uses inline SVG; swap point for Lottie/canvas is inside the layer.
