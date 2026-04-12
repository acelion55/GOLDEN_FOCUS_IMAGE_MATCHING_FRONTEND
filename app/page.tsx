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
    <div className="w-full bg-black/85 text-foreground">
      {/* 1. Hero Section */}
      <HeroSection />

      <div className="relative z-10 pt-[105vh]">
        
        {/* 2. Methodology Section (Z-10) */}
        <div className="relative z-10"> 
            <MethodologySection />
      
        </div>

        {/* 3. Zoom Section (Z-20) - Methodology ke upar slide hoga */}
        <div className="relative  z-20">
          <LazyLoad fallback={<div className="w-full h-[200vh] bg-[#8497ab] animate-pulse" />}>
            <ZoomSection />
          </LazyLoad>
        </div>

        {/* 4. What We Do Section (Z-30) - Zoom ke upar slide hoga */}
        <div className="relative z-30">
          <LazyLoad fallback={<div className="w-full h-screen bg-[#8497ab] animate-pulse" />}>
            <WhatWeDoSection />
          </LazyLoad>
        </div>

        {/* 5. Why GoldenFocus (Z-40) - Iska design ab aapke Methodology wale code jaisa hi hoga */}
        <div className="relative z-40">
          <LazyLoad fallback={<div className="w-full h-screen bg-white animate-pulse" />}>
            <WhyGoldenFocusSection />
          </LazyLoad>
        </div>

        {/* 6. How It Works (Z-50) */}
        <div className="relative z-50">
          <LazyLoad fallback={<div className="w-full h-screen bg-[#f5793b] animate-pulse" />}>
            <HowItWorksSection />
          </LazyLoad>
        </div>

      </div>
    </div>
  );
}