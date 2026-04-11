"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ZoomSection() {
  const bgImageRef = useRef<HTMLImageElement>(null);
  const circleImageRef = useRef<HTMLImageElement>(null);
  const zoomSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zoomSectionRef.current || !bgImageRef.current || !circleImageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: zoomSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
        },
      })
      .fromTo(bgImageRef.current, { scale: 1 }, { scale: 2.5, ease: "none" }, 0)
      .fromTo(circleImageRef.current, { scale: 1, opacity: 1 }, { scale: 3, opacity: 0, ease: "none" }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={zoomSectionRef} className="w-full h-[200vh] flex items-center justify-center border-b border-border bg-[#8497ab] overflow-hidden">
      <div className="w-full h-screen flex items-center justify-center">
        <img
          ref={bgImageRef}
          src="/screenzoom.png"
          alt="Background"
          className="w-full h-full object-cover will-change-transform"
        />
        <img
          ref={circleImageRef}
          src="/circle.png"
          alt="Center Circle"
          className="absolute z-10 w-[25%] md:w-[15%] h-auto will-change-transform"
        />
      </div>
    </section>
  );
}
