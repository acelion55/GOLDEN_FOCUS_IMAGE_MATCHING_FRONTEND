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
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
            className="feature-row group relative h-[13vh] lg:h-[13vh] border-b border-white/20 overflow-hidden"
          >
            {/* 1. TITLE */}
            <div className="feature-title absolute inset-0 flex items-center group-hover:-translate-y-full group-hover:opacity-0" style={{ transitionProperty: "none" }}>
              <h4 className="text-[24px] lg:text-[3rem] font-bold leading-none tracking-tighter text-white">
                {item.title}
              </h4>
            </div>

            {/* 2. DESCRIPTION */}
            <div className="feature-description absolute inset-0 flex items-center translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100" style={{ transitionProperty: "none" }}>
              <p className="text-[14px] lg:text-[1.2rem] text-[#a3925d] font-medium max-w-[80%]">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
