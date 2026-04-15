"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

const scrollingImages = [
  { bg: "/savehour.jpg" },
  { bg: "/delight%20client.jpg" },
  { bg: "/secure.jpg" },
  { bg: "/work%20for%20every%20event%20.jpg" },
];

export default function MethodologyBackground() {
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(-1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cardIndex = parseInt(entry.target.getAttribute("data-index") || "0");
              
              // Change background image
              scrollingImages.forEach((_, idx) => {
                const layer = document.querySelector(`.bg-layer-${idx}`) as HTMLElement;
                if (layer) {
                  gsap.to(layer, { opacity: 0, duration: 0.4 });
                }
              });
              
              const currentLayer = document.querySelector(`.bg-layer-${cardIndex}`) as HTMLElement;
              if (currentLayer) {
                gsap.to(currentLayer, { opacity: 0.6, duration: 0.4 });
              }

              prevIndexRef.current = cardIndex;
            }
          });
        },
        { threshold: 0.5, root: null }
      );

      const cards = document.querySelectorAll(".individual-image-card");
      cards.forEach((card) => observer.observe(card));

      return () => {
        cards.forEach((card) => observer.unobserve(card));
        observer.disconnect();
      };
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={bgContainerRef} className="absolute inset-0 z-0 w-full h-full">
      {scrollingImages.map((img, i) => (
        <div
          key={i}
          className={`bg-layer bg-layer-${i} absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat`}
          style={{
            backgroundImage: `url('${img.bg}')`,
            opacity: i === 0 ? 0.3 : 0,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 w-full h-full bg-black/80" />
        </div>
      ))}
    </div>
  );
}
