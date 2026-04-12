"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const scrollingImages = [
  { src: "/savehour.jpg", alt: "Save Hours" },
  { src: "/delight client.jpg", alt: "Delight Clients" },
  { src: "/secure.jpg", alt: "Secure" },
  { src: "/work for every event .jpg", alt: "Events" },
];

export default function WhyGoldenFocusImages() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Right Side Cards Smooth Scroll
      gsap.to(".scrolling-images-container", {
        y: (i, target) => -(target.scrollHeight - window.innerHeight + 100),
        ease: "none",
        scrollTrigger: {
          trigger: ".why-pinned-section",
          start: "top top",
          end: "+=3000",
          scrub: 1,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 w-full h-[80vh] overflow-hidden relative self-center">
      <div className="scrolling-images-container space-y-[20vh] pt-[30vh]">
        {scrollingImages.map((image, i) => (
          <div
            key={i}
            className="individual-image-card w-full aspect-[4/5] lg:aspect-[5/3] overflow-hidden rounded-md shadow-2xl bg-zinc-900"
          >
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
