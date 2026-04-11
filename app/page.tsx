"use client";

import { Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "./components/sections/HeroSection";
import MethodologySection from "./components/sections/MethodologySection";
import ZoomSection from "./components/sections/ZoomSection";
import WhatWeDoSection from "./components/sections/WhatWeDoSection";
import WhyGoldenFocusSection from "./components/sections/WhyGoldenFocusSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import LazyLoad from "./components/LazyLoad";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  return (
    <div className="w-full bg-black/80 text-foreground">
      <HeroSection />

      <div className="top-[105vh] z-11 relative">
        <LazyLoad fallback={<div className="w-full h-[140vh] bg-[#6b7a8f] animate-pulse" />}>
          <MethodologySection />
        </LazyLoad>

        <LazyLoad fallback={<div className="w-full h-[200vh] bg-[#8497ab] animate-pulse" />}>
          <ZoomSection />
        </LazyLoad>

        <LazyLoad fallback={<div className="w-full h-[120vh] bg-[#8497ab] animate-pulse" />}>
          <WhatWeDoSection />
        </LazyLoad>

        <LazyLoad fallback={<div className="w-full h-[140vh] bg-[#8e9487] animate-pulse" />}>
          <WhyGoldenFocusSection />
        </LazyLoad>

        <LazyLoad fallback={<div className="w-full h-[180vh] bg-[#f5793b] animate-pulse" />}>
          <HowItWorksSection />
        </LazyLoad>
      </div>
    </div>
  );
}
