"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  { title: "Save Hours of Work", desc: "Automate selection and sorting. Less desk time, more shooting." },
  { title: "Delight Your Clients", desc: "Instant gratification with modern photo delivery." },
  { title: "Secure & Private", desc: "Bank-grade encryption and auto-deletion policies." },
  { title: "Works for Any Event", desc: "From corporate mixers to massive music festivals." },
];

export default function WhyGoldenFocusFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.from(".feature-row", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".features-container",
          start: "top 75%",
          once: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const titleChars = target.querySelectorAll(".title-char");
    const desc = target.querySelector(".feature-description");

    // 3D Depth Calculation
    const depth = -target.offsetWidth / 12;
    const tOrigin = `50% 50% ${depth}px`;

    const tl = gsap.timeline();

    // Title rolls UP and away
    tl.to(titleChars, {
      rotationX: 90,
      y: "-50%",
      opacity: 0,
      stagger: 0.02,
      duration: 0.5,
      ease: "power2.inOut",
      transformOrigin: tOrigin,
    });

    // Description rolls IN from bottom
    tl.fromTo(desc, 
      { rotationX: -90, y: "50%", opacity: 0 },
      { 
        rotationX: 0, 
        y: "0%", 
        opacity: 1, 
        duration: 0.6, 
        ease: "power2.out",
        transformOrigin: tOrigin 
      }, 
      "-=0.4"
    );
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const titleChars = target.querySelectorAll(".title-char");
    const desc = target.querySelector(".feature-description");

    const depth = -target.offsetWidth / 12;
    const tOrigin = `50% 50% ${depth}px`;

    const tl = gsap.timeline();

    // Description rolls DOWN and away
    tl.to(desc, {
      rotationX: -90,
      y: "50%",
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      transformOrigin: tOrigin,
    });

    // Title rolls back DOWN into view
    tl.to(titleChars, {
      rotationX: 0,
      y: "0%",
      opacity: 1,
      stagger: 0.02,
      duration: 0.5,
      ease: "back.out(1.7)",
      transformOrigin: tOrigin,
    }, "-=0.2");
  };

  return (
    <div ref={containerRef} className="features-container w-full">
      <p className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
        Excellence Defined
      </p>
      <h2 className="text-[32px] lg:text-[2.4rem] font-serif mb-[2vh] text-white">
        Why GoldenFocus AI?
      </h2>
      
      <div className="flex flex-col border-t border-white/20 w-full">
        {features.map((item, i) => (
          <div 
            key={i} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="feature-row group relative h-[13vh] border-b border-white/20 overflow-hidden cursor-pointer"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            {/* 1. TITLE (Split into spans for char animation) */}
            <div className="feature-title absolute inset-0 flex items-center pointer-events-none">
              <h4 className="text-[24px] lg:text-[3rem] font-bold leading-none tracking-tighter text-white">
                {item.title.split("").map((char, index) => (
                  <span key={index} className="title-char inline-block" style={{ whiteSpace: "pre" }}>
                    {char}
                  </span>
                ))}
              </h4>
            </div>

            {/* 2. DESCRIPTION */}
            <div className="feature-description absolute inset-0 flex items-center opacity-0 pointer-events-none">
              <p className="text-[14px] lg:text-[1.2rem] text-[#a3925d] font-medium max-w-[80%] italic uppercase tracking-wider">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}