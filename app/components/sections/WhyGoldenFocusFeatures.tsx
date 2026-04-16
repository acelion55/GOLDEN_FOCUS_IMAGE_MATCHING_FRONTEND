"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const features = [
  { title: "Save Hours of Work", desc: "Automate selection and sorting. Less desk time, more shooting." },
  { title: "Delight Your Clients", desc: "Instant gratification with modern photo delivery." },
  { title: "Secure & Private", desc: "Bank-grade encryption and auto-deletion policies." },
  { title: "Works for Any Event", desc: "From corporate mixers to massive music festivals." },
];

export default function WhyGoldenFocusFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitTextsRef = useRef<any[]>([]);
  const prevIndexRef = useRef(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      const rows = containerRef.current?.querySelectorAll(".feature-row");
      if (!rows) return;

      // Split text only for titles
      splitTextsRef.current = Array.from(rows).map((row: any) => {
        const titleDiv = row.querySelector(".feature-title");
        return new SplitText(titleDiv, { type: "chars", charsClass: "char" });
      });

      // Setup 3D perspective
      const width = window.innerWidth;
      const depth = -width / 8;
      const transformOrigin = `50% 50% ${depth}px`;

      rows.forEach((row: any, idx: number) => {
        const titleDiv = row.querySelector(".feature-title");
        const descDiv = row.querySelector(".feature-description");
        
        gsap.set(titleDiv, { 
          perspective: 700, 
          transformStyle: "preserve-3d",
          transformOrigin 
        });

        gsap.set(descDiv, { 
          perspective: 700, 
          transformStyle: "preserve-3d",
          transformOrigin 
        });
        
        // Initialize title chars visible (rotationX: 0)
        gsap.set(splitTextsRef.current[idx].chars, { rotationX: 0 });
        
        // Initialize description hidden (rotationX: -90)
        gsap.set(descDiv, { rotationX: -90 });
      });

      // Listen for image card changes
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cardIndex = parseInt(entry.target.getAttribute("data-index") || "0");
              const isScrollingDown = cardIndex > prevIndexRef.current;

              if (cardIndex !== prevIndexRef.current && splitTextsRef.current[cardIndex]) {
                const row = rows[cardIndex] as HTMLElement;
                const titleChars = splitTextsRef.current[cardIndex].chars;
                const descDiv = row.querySelector(".feature-description") as HTMLElement;

                // Kill any existing animations
                gsap.killTweensOf(titleChars);
                gsap.killTweensOf(descDiv);

                if (isScrollingDown) {
                  // Scroll down: title flips out, description flips in
                  gsap.to(titleChars, {
                    rotationX: 90,
                    stagger: 0.03,
                    duration: 0.4,
                    ease: "power2.out",
                    transformOrigin,
                  });
                  
                  gsap.to(descDiv, {
                    rotationX: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    transformOrigin,
                    delay: 0.1,
                  });
                } else {
                  // Scroll up: description flips out, title flips in
                  gsap.to(descDiv, {
                    rotationX: -90,
                    duration: 0.4,
                    ease: "power2.out",
                    transformOrigin,
                  });
                  
                  gsap.to(titleChars, {
                    rotationX: 0,
                    stagger: 0.03,
                    duration: 0.4,
                    ease: "power2.out",
                    transformOrigin,
                    delay: 0.1,
                  });
                }

                prevIndexRef.current = cardIndex;
              }
            }
          });
        },
        { 
          threshold: 0.6,
          rootMargin: "-20% 0px -20% 0px"
        }
      );

      // Wait for images to be available
      const checkForCards = () => {
        const cards = document.querySelectorAll(".individual-image-card");
        if (cards.length > 0) {
          cards.forEach((card) => cardObserver.observe(card));
        } else {
          setTimeout(checkForCards, 100);
        }
      };

      checkForCards();

      return () => {
        const cards = document.querySelectorAll(".individual-image-card");
        cards.forEach((card) => cardObserver.unobserve(card));
        cardObserver.disconnect();
      };
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="features-container w-full py-20 px-10">
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
            className="feature-row group relative h-[13vh] border-b border-white/20 overflow-hidden"
            style={{ perspective: "1000px" }}
          >
            <div className="feature-title absolute inset-0 flex items-center pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
              <h4 className="text-[24px] lg:text-[3rem] font-bold leading-none tracking-tighter text-white">
                {item.title}
              </h4>
            </div>

            <div 
              className="feature-description absolute inset-0 flex items-center pointer-events-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              <p className="text-[14px] lg:text-[1.8rem] text-[#a3925d] font-medium max-w-[90%] leading-tight italic">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}