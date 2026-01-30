"use client";

import { useEffect, useRef, useState } from "react";

const LERP_POS = 0.06;
const LERP_ROT = 0.04;
const DEAD_ZONE = 0.15;
const MAX_RADIUS = 0.28;
const FPS_SAMPLE = 10;
const FPS_THRESHOLD_MS = 50;
const INTERACTIVE_SELECTOR = 'a[href], button, [role="button"], [data-modal]';

type Mode = "hidden" | "pointer" | "ambient";

function getInitialMode(): Mode {
  if (typeof window === "undefined") return "hidden";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "hidden";
  if (window.matchMedia("(hover: none)").matches) return "ambient";
  return "pointer";
}

export function DragonBackground() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const state = useRef({
    targetX: 0.5,
    targetY: 0.5,
    x: 0.5,
    y: 0.5,
    rotate: 0,
    targetRotate: 0,
    pointerX: 0.5,
    pointerY: 0.5,
    dimmed: false,
    lastFrames: [] as number[],
  });
  const rafRef = useRef<number>(0);
  const switchedRef = useRef(false);

  useEffect(() => {
    const idle =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(
            () => setMounted(true),
            { timeout: 400 }
          )
        : (setTimeout(() => setMounted(true), 200) as unknown as number);

    return () => {
      if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initial = getInitialMode();
    setMode(initial);
    if (initial === "hidden") return;
    if (initial === "ambient") {
      document.documentElement.setAttribute("data-dragon-mode", "ambient");
      return;
    }
    document.documentElement.setAttribute("data-dragon-mode", "pointer");

    const setDimmed = (dimmed: boolean) => {
      state.current.dimmed = dimmed;
      document.documentElement.toggleAttribute("data-dragon-dimmed", dimmed);
    };

    const handleMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      state.current.pointerX = e.clientX / w;
      state.current.pointerY = e.clientY / h;

      const dx = state.current.pointerX - 0.5;
      const dy = state.current.pointerY - 0.5;
      const dist = Math.hypot(dx, dy);

      if (dist < DEAD_ZONE) {
        state.current.targetX = 0.5;
        state.current.targetY = 0.5;
        state.current.targetRotate = 0;
      } else {
        const r = Math.min(dist, MAX_RADIUS);
        const scale = r / dist;
        state.current.targetX = 0.5 + dx * scale;
        state.current.targetY = 0.5 + dy * scale;
        state.current.targetRotate = (Math.atan2(dy, dx) * 180) / Math.PI;
      }
    };

    const tick = (now: number) => {
      if (switchedRef.current) return;

      const s = state.current;
      const frames = s.lastFrames;
      frames.push(now);
      if (frames.length > FPS_SAMPLE) frames.shift();

      if (frames.length >= FPS_SAMPLE) {
        const avgDelta = (frames[frames.length - 1]! - frames[0]!) / (frames.length - 1);
        if (avgDelta > FPS_THRESHOLD_MS) {
          switchedRef.current = true;
          setMode("ambient");
          document.documentElement.setAttribute("data-dragon-mode", "ambient");
          cancelAnimationFrame(rafRef.current);
          return;
        }
      }

      try {
        s.x += (s.targetX - s.x) * LERP_POS;
        s.y += (s.targetY - s.y) * LERP_POS;
        s.rotate += (s.targetRotate - s.rotate) * LERP_ROT;

        const opacity = s.dimmed ? 0.06 : 0.14;
        document.documentElement.style.setProperty("--dragon-x", `${s.x * 100}%`);
        document.documentElement.style.setProperty("--dragon-y", `${s.y * 100}%`);
        document.documentElement.style.setProperty("--dragon-rotate", `${s.rotate}deg`);
        document.documentElement.style.setProperty("--dragon-opacity", String(opacity));
      } catch {
        switchedRef.current = true;
        setMode("ambient");
        document.documentElement.setAttribute("data-dragon-mode", "ambient");
        cancelAnimationFrame(rafRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    const interactive = document.querySelectorAll(INTERACTIVE_SELECTOR);
    const onEnter = () => setDimmed(true);
    const onLeave = () => setDimmed(false);
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      setDimmed(false);
    };
  }, [mounted]);

  if (!mounted || mode === "hidden") return null;

  const isAmbient = mode === "ambient";

  return (
    <div
      className={`dragon-layer ${isAmbient ? "dragon-layer--ambient" : ""}`}
      aria-hidden
      role="presentation"
      data-dragon-mode={isAmbient ? "ambient" : "pointer"}
    >
      <svg
        className={`dragon-svg ${isAmbient ? "dragon-svg--ambient" : ""}`}
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id="dragon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor="var(--dragon-primary)" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M12 38 Q20 12 42 14 Q62 16 75 28 Q85 38 80 48 Q74 56 55 56 Q32 56 18 46 Q10 42 12 38 Z"
          fill="currentColor"
          filter="url(#dragon-glow)"
        />
        <circle cx="52" cy="32" r="4" fill="var(--dragon-accent)" opacity="0.95" />
      </svg>
    </div>
  );
}
