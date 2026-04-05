"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth scroll for the document. Uses Lenis `autoRaf`.
 * If you add GSAP ScrollTrigger later, switch to manual raf + ScrollTrigger.update — see Lenis docs.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      lerp: 0.09,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
