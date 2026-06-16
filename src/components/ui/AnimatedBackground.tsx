"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const initialPointerVars = {
  "--sg-cursor-x": "50%",
  "--sg-cursor-y": "45%",
} as CSSProperties;

export function AnimatedBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;
    const element = rootElement;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) return;

    const target = { x: 50, y: 45 };
    const current = { x: 50, y: 45 };
    let frameId = 0;

    function handlePointerMove(event: PointerEvent) {
      target.x = (event.clientX / window.innerWidth) * 100;
      target.y = (event.clientY / window.innerHeight) * 100;
    }

    function tick() {
      current.x += (target.x - current.x) * 0.055;
      current.y += (target.y - current.y) * 0.055;
      element.style.setProperty("--sg-cursor-x", `${current.x.toFixed(2)}%`);
      element.style.setProperty("--sg-cursor-y", `${current.y.toFixed(2)}%`);
      frameId = window.requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={initialPointerVars}
    >
      <div className="sg-mesh-layer absolute inset-[-12%]" />
      <div className="sg-aurora-layer absolute inset-[-18%]" />
      <div className="sg-orbit-glow-layer absolute inset-[-10%]" />
      <div className="sg-wave-layer absolute inset-0" />
      <svg
        className="sg-wave-svg-layer absolute inset-x-[-10%] top-[18%] h-[58%] w-[120%]"
        viewBox="0 0 1440 560"
        preserveAspectRatio="none"
      >
        <path
          className="sg-wave-path-primary"
          d="M0 310C150 250 277 248 430 302C593 360 735 362 894 286C1055 209 1210 211 1440 275"
        />
        <path
          className="sg-wave-path-accent"
          d="M0 390C178 320 322 318 512 372C694 424 826 421 1010 346C1188 273 1304 283 1440 335"
        />
      </svg>
      <div className="sg-light-ribbon-layer absolute inset-0" />
      <div className="sg-cursor-glow-layer absolute inset-0" />
      <div className="sg-grid-layer absolute inset-0" />
      <div className="sg-scan-layer absolute inset-0" />
      <div className="sg-backdrop-layer absolute inset-0" />
    </div>
  );
}
