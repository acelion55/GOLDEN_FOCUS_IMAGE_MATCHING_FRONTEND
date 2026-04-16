"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scrolling from "../sections/scrolling"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ZoomSection() {
  const bgImageRef = useRef<HTMLImageElement>(null);
  const circleImageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const zoomSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zoomSectionRef.current || !bgImageRef.current || !circleImageRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: zoomSectionRef.current,
          start: "top -20%",
          end: "40%",    
          scrub: 1,
          pin: true,
        },
      })
      // Background image scale up hoga
      .fromTo(bgImageRef.current, { scale: 1 }, { scale: 2.5, ease: "none" }, 0)
      
      // Circle scale up aur fade out hoga
      .fromTo(circleImageRef.current, { scale: 1, opacity: 1 }, { scale: 2.5, opacity: 0, ease: "none" }, 0)
      
      // Text bhi circle ke sath hi scale up aur fade out hoga
      .fromTo(textRef.current, { scale: 1, opacity: 1 }, {  opacity: 0, ease: "none" }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={zoomSectionRef} className="relative w-full   h-[180vh] bg-transparent  overflow-hidden ">
      {/* Wrapper to hold everything centered */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* 1. Background Image */}
        <img
          ref={bgImageRef}
          src="/screenzoom.png"
          alt="Background"
          className="w-full h-auto top-20 z-10 object-contain will-change-transform"
        />

        {/* 2. Circle Image Overlay */}
        <img
          ref={circleImageRef}
          src="/circle.png"
          alt="Center Circle"
          className="absolute z-10 w-[90%] md:w-[60%] -ml-[3.5%] h-auto will-change-transform"
        />
      
        {/* 3. Middle Text Overlay (Left Aligned) */}
        <div 
          ref={textRef}
          className="absolute z-20 mt-[40%] w-full h-full"
        >
          {/* Is container se text middle mein rahega par left align hoga */}
          <div className="max-w-[1200px] w-full px-[10vw] text-left">
            <h2 className="text-white text-[40px] md:text-[80px] font-serif leading-tight">
              Capturing <br />
              <span className="italic">Every Detail</span>
            </h2>
            <p className="text-white/80 text-[18px] mt-4 max-w-md">
              Our AI technology ensures that no moment is missed, indexing every face with precision.
            </p>
          </div>
        </div>

      </div>
 <div className="relative  z-0">
      <div className=" z-0"><Scrolling /></div>
        </div>
    </section>
  );
}