"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = 'a[href], button, [role="button"], [data-cursor-interactive]';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, ringX: 0, ringY: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (prefersReducedMotion || !hasHover) return;

    setEnabled(true);

    const handleMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      setVisible(true);
    };

    const tick = () => {
      const { x, y, ringX, ringY } = posRef.current;
      const nextRingX = ringX + (x - ringX) * 0.15;
      const nextRingY = ringY + (y - ringY) * 0.15;
      posRef.current.ringX = nextRingX;
      posRef.current.ringY = nextRingY;

      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
      document.documentElement.style.setProperty("--cursor-ring-x", `${nextRingX}px`);
      document.documentElement.style.setProperty("--cursor-ring-y", `${nextRingY}px`);

      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
      setEnabled(false);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const addClass = () => document.documentElement.classList.add("cursor-custom");
    const removeClass = () => document.documentElement.classList.remove("cursor-custom");

    addClass();
    return () => removeClass();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const setHover = (over: boolean) => {
      document.documentElement.classList.toggle("cursor-hover", over);
    };

    const handleEnter = () => setHover(true);
    const handleLeave = () => setHover(false);

    const interactive = document.querySelectorAll(INTERACTIVE_SELECTOR);
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={`cursor-wrapper ${visible ? "cursor-visible" : ""}`}
      aria-hidden
    >
      <div
        className="cursor-dot"
        style={{
          left: "var(--cursor-x, 0)",
          top: "var(--cursor-y, 0)",
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          left: "var(--cursor-ring-x, 0)",
          top: "var(--cursor-ring-y, 0)",
        }}
      />
    </div>
  );
}
