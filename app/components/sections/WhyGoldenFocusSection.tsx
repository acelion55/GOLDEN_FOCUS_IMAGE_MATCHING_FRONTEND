"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  { title: "Save Hours of Work", desc: "No more manually sorting and sending photos. Upload once, let AI do the rest. No more manually sorting and sending photos. Upload once, let AI do the rest." },
  { title: "Delight Your Clients", desc: "Clients get their photos in seconds — a seamless, modern experience they'll remember. Clients get their photos in seconds — a seamless, modern experience they'll remember." },
  { title: "Secure & Private", desc: "Face data is processed securely. Clients only see their own photos, nothing else. Face data is processed securely. Clients only see their own photos, nothing else." },
  { title: "Works for Any Event", desc: "Weddings, marathons, school events, corporate gatherings — any crowd, any size. Weddings, marathons, school events, corporate gatherings — any crowd, any size." },
];

export default function WhyGoldenFocusSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".benefit-card");
      
      cards.forEach((card) => {
        const titleEl = card.querySelector(".benefit-title") as HTMLElement | null;
        const descContainer = card.querySelector(".desc-scroll-container") as HTMLElement | null;
        const descText = card.querySelector(".desc-text") as HTMLElement | null;

        if (!titleEl || !descContainer || !descText) return;

        card.addEventListener("mouseenter", () => {
          // Animate title UP and fade out
          gsap.to(titleEl, {
            y: -50,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });

          // Animate description UP from bottom (from y: 50 to y: 0)
          gsap.fromTo(descContainer, 
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              pointerEvents: "auto",
              duration: 0.4,
              ease: "power2.inOut",
            }
          );

          // Start infinite horizontal scroll
          const textWidth = descText.offsetWidth;
          const containerWidth = descContainer.offsetWidth;
          
          if (textWidth > containerWidth) {
            gsap.to(descText, {
              x: -(textWidth - containerWidth + 20),
              duration: textWidth / 50,
              ease: "none",
              repeat: -1,
              yoyo: true,
            });
          }
        });

        card.addEventListener("mouseleave", () => {
          // Animate title back DOWN
          gsap.to(titleEl, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          });

          // Animate description DOWN to bottom
          gsap.to(descContainer, {
            y: 50,
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.inOut",
          });

          // Kill scroll animation
          gsap.killTweensOf(descText);
          gsap.to(descText, {
            x: 0,
            duration: 0.3,
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full h-[140vh] mt-15vh sticky -top-40 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-[#8e9487]">
      <h2 className="font-pixel text-[2.5vw] md:text-[3.5vw] text-yellow-400 mb-[6vh] text-center">Why GoldenFocus AI?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vw] w-full max-w-[90vw]">
        {benefits.map((item) => (
          <div key={item.title} className="benefit-card flex gap-[1vw] p-[2vw] border border-white/10 bg-white/5 backdrop-blur rounded-xl cursor-pointer relative overflow-hidden h-[80px] flex flex-col justify-center">
            <span className="text-yellow-400 font-pixel text-[1.5vw] md:text-[2vw] shrink-0">▸</span>
            
            {/* Title - scrolls UP on hover */}
            <h3 className="benefit-title font-pixel text-[1.3vw] md:text-[2vw] lg:text-[1.3vw] text-white absolute top-[2vw] left-[2vw]">
              {item.title}
            </h3>
            
            {/* Description - comes from BOTTOM on hover with infinite scroll */}
            <div 
              className="desc-scroll-container absolute inset-0 flex items-center opacity-0 pointer-events-none overflow-hidden p-[2vw]"
              style={{ 
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <p className="desc-text text-white/50 text-[1vw] md:text-[1.5vw] lg:text-[1vw] whitespace-nowrap">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
