"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";

export default function HorizontalInfiniteScroll() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const segmentsCount = 60; 

  const settings = {
    intensity: 1.8,
    cardWidth: 340,
    cardHeight: 520,
    gap: 130, 
  };

  const cardsData = [
    { name: 'ERIN J.', location: 'Canada, Toronto', label: 'Artist' },
    { name: 'ALEX M.', location: 'USA, New York', label: 'Photographer' },
    { name: 'SARA K.', location: 'UK, London', label: 'Designer' },
    { name: 'MIKE P.', location: 'Australia, Sydney', label: 'Creator' },
    { name: 'LUNA R.', location: 'France, Paris', label: 'Artist' },
    { name: 'JAMES T.', location: 'Japan, Tokyo', label: 'Visionary' },
  ];

  // Auto Slide with Intersection Observer
  useEffect(() => {
    const section = containerRef.current?.querySelector('section');
    if (!section) return;

    let interval;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cardsData.length);
          }, 2500);
        } else {
          clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => {
      observer.unobserve(section);
      clearInterval(interval);
    };
  }, [cardsData.length]);

  // Curve & Pinch Logic
  useLayoutEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".curved-card");
    cards?.forEach((card, cardIdx) => {
      const segments = card.querySelectorAll(".card-segment");
      const isActive = cardIdx === currentIndex;

      segments.forEach((seg, i) => {
        const progress = i / segmentsCount;
        const arc = Math.sin(progress * Math.PI); 
        
        const angle = arc * settings.intensity;
        const zOffset = arc * 80;

        const pinchStrength = isActive ? 0.05 : 0.25; 
        const pinchScale = 1 - (arc * pinchStrength);

        gsap.to(seg, { 
          rotateX: angle, 
          z: zOffset,
          scaleX: pinchScale,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: "center center",
          // Smooth rendering fixes
          force3D: true,
          backfaceVisibility: "hidden"
        });
      });
    });
  }, [currentIndex]);

  return (
    <div ref={containerRef} className="bg-zinc-950 font-sans min-h-screen overflow-hidden">
      
      <section className=" h-[180vh] flex items-center justify-center bg-[#c9838a]" style={{ perspective: "2500px" }}>
        
          <div className="sticky top-[50vh] bg-slate-600 flex items-center  justify-center w-0 h-0" style={{ transformStyle: "preserve-3d" }}>
          
          <div
            className="flex items-center bg-amber-400 transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateX(${-currentIndex * (settings.cardWidth + settings.gap)}px)`,
            }}
          >
            {cardsData.map((data, idx) => {
              const isActive = idx === currentIndex;
              const isPast = idx < currentIndex;

              return (
                <div
                  key={idx}
                  className="curved-card absolute flex-shrink-0"
                  style={{
                    width: `${settings.cardWidth}px`,
                    height: `${settings.cardHeight}px`,
                    left: `${idx * (settings.cardWidth + settings.gap)}px`,
                    marginLeft: `-${settings.cardWidth / 2}px`, 
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                    opacity: isActive ? 1 : 0.5,
                    scale: isActive ? 1 : 0.8,
                    transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    // Fix for edges
                    overflow: "visible", 
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transform: `rotateY(${isActive ? 0 : isPast ? 40 : -40}deg)`,
                      transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* PAPER SEGMENTS */}
                    {[...Array(segmentsCount)].map((_, i) => {
                      const h = settings.cardHeight / segmentsCount;
                      return (
                        <div key={i} className="card-segment absolute left-0 w-full overflow-hidden"
                          style={{ 
                            // 1px overlap taaki white lines na dikhein
                            height: `${h + 1}px`, 
                            top: `${i * h}px`, 
                            backgroundColor: i < segmentsCount * 0.38 ? "#fff" : "#000", 
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden"
                          }}>
                          <div className="absolute w-full" style={{ top: `-${i * h}px`, height: `${settings.cardHeight}px` }}>
                            <div className="h-[35%] bg-white p-6 flex flex-col justify-between border-b border-zinc-100">
                              <span className="text-[10px] tracking-[0.2em] text-zinc-400 font-bold uppercase">Follow.Art</span>
                              <h1 className="text-4xl font-black italic tracking-tighter text-black leading-none">{data.name}</h1>
                            </div>
                            <div className="h-[65%] bg-black p-8 text-white relative">
                              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{data.label}</p>
                              <p className="text-zinc-400 text-sm mt-1">{data.location}</p>
                              
                              <div className="absolute inset-0 pointer-events-none"
                                style={{ 
                                    background: isActive 
                                    ? 'none' 
                                    : `linear-gradient(${isPast ? '90deg' : '-90deg'}, rgba(0,0,0,0.6), transparent)` 
                                }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Floating Image Wrapper with high Z-index */}
                    <div className="absolute right-6 top-[28%] w-32 bg-white p-1 shadow-2xl transition-all duration-1000 z-50"
                      style={{ 
                        transform: `translateZ(120px) rotate(${isActive ? 4 : 0}deg)`, 
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.5,
                        visibility: isActive ? "visible" : "hidden"
                      }}>
                      <div className="aspect-square bg-zinc-200 grayscale overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`} alt="p" />
                      </div>
                      <div className="p-2 text-[6px] text-black font-mono tracking-tighter">SCENE {idx + 1} // TAKE 1</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Progress Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {cardsData.map((_, i) => (
          <div key={i} className={`h-1 transition-all duration-500 ${currentIndex === i ? 'w-10 bg-white' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}