"use client";

import { useRef, useEffect } from "react";
import Rotate from "@/components/Rotate";
import { Suspense } from "react";
import HeroPanel from "@/components/HeroPanel";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const offset = Math.min(window.scrollY, window.innerHeight * 0.05);
      hero.style.transform = `translateY(-${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      id="photographer-auth"
      className="fixed z-0 top-0 left-0 w-full h-[105vh] flex flex-col md:flex-row md:items-start border-b bg-black/40 border-border lg:pt-[10vh] pt-[7vh] overflow-hidden md:overflow-visible"
    >
      <div id="hero" className="md:flex-1 flex flex-col justify-start md:justify-center md:p-0 px-2 lg:px-4 xl:px-0">
        <h1 className="text-[23vw] md:text-[18vw] lg:text-[16vw] sm:text-[35vw] font-bold leading-[0.85]">GOLDEN</h1>
        <h1 className="sm:text-[10rem] md:text-[17vw] lg:text-[15vw] text-[23vw] font-bold leading-[0.85]">FOCUS</h1>
        <div className="relative flex items-end gap-3">
          <h1 className="w-fit text-[23vw] md:text-[14vw] lg:text-[12vw] sm:text-[28vw] font-bold leading-[0.85]">AI</h1>
          <p className="text-white/60 text-sm sm:text-base md:text-[1.8vw] lg:text-lg max-w-[50vw] sm:max-w-[40vw] lg:max-w-[18vw] lg:mb-1 -ml-2 lg:-ml-4">
            AI-powered face recognition for photographers. Upload photos, clients find themselves instantly.
          </p>
        </div>
      </div>

      <Rotate />

      <Suspense fallback={<div className="w-full xl:w-[min(30%,32rem)] h-20 animate-pulse bg-white/10" />}>
        <HeroPanel />
      </Suspense>
    </section>
  );
}
