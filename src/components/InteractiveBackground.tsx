"use client";

import { useEffect, useRef, useState } from "react";

// Brand colors (hex for Three.js): primary #0D0D12, accent #C9A962
const BG_COLOR = 0x0d0d12;
const MESH_COLOR = 0xc9a962;

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<{ destroy: () => void } | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const initVanta = async () => {
      try {
        const threeModule = await import("three");
        const THREE = threeModule.default ?? threeModule;
        const vantaNetModule = await import("vanta/dist/vanta.net.min");
        const NET = (vantaNetModule.default ?? vantaNetModule) as (opts: {
          el: HTMLElement;
          THREE: typeof threeModule;
          color?: number;
          backgroundColor?: number;
          [key: string]: unknown;
        }) => { destroy: () => void };

        if (!mounted || !containerRef.current) return;

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
      } catch {
        if (mounted) setUseFallback(true);
      }
    };

    initVanta();

    return () => {
      mounted = false;
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-bg"
      aria-hidden
      role="presentation"
    >
      {/* CSS fallback: always-in-motion gradient when Vanta fails or is loading */}
      <div className={`interactive-bg-fallback ${useFallback ? "interactive-bg-fallback--active" : ""}`} />
    </div>
  );
}
