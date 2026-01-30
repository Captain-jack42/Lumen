"use client";

import { useEffect, useRef, useState } from "react";

// Brand colors (hex for Three.js): primary #0D0D12, accent #C9A962
const BG_COLOR = 0x0d0d12;
const MESH_COLOR = 0xc9a962;

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vantaRef = useRef<{ destroy: () => void } | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Server guard
    if (typeof window === "undefined") return;

    let mounted = true;

    // Respect user motion preference and touch devices early
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (prefersReduced || isTouch) {
      setUseFallback(true);
      return;
    }

    // Lazy init after first paint to avoid blocking FCP
    const initAfterPaint = async () => {
      // wait one frame so page can paint
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      if (!mounted || !containerRef.current) return;

      try {
        // dynamic import; cast to any to avoid TS `.default` mismatch
        const threeModule = await import("three");
        const THREE = (threeModule as any).default ?? (threeModule as any);

        const vantaNetModule = await import("vanta/dist/vanta.net.min");
        const NET = (vantaNetModule as any).default ?? (vantaNetModule as any);

        if (!mounted || !containerRef.current) return;

        // initialize Vanta effect
        const effect = NET({
          el: containerRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: MESH_COLOR,
          backgroundColor: BG_COLOR,
          points: 12,
          maxDistance: 22,
          spacing: 16,
          showDots: true,
        });

        if (mounted) vantaRef.current = effect;
      } catch (err) {
        // if anything fails, fall back to CSS animation
        // keep the error for debugging but do not break the app
        // eslint-disable-next-line no-console
        console.error("Vanta/three init failed:", err);
        if (mounted) setUseFallback(true);
      }
    };

    initAfterPaint();

    return () => {
      mounted = false;
      if (vantaRef.current) {
        try {
          vantaRef.current.destroy();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Error destroying Vanta effect", err);
        }
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-bg"
      aria-hidden="true"
      role="presentation"
    >
      {/* CSS fallback: always-in-motion gradient when Vanta fails or is loading */}
      <div
        className={`interactive-bg-fallback ${
          useFallback ? "interactive-bg-fallback--active" : ""
        }`}
      />
    </div>
  );
}
