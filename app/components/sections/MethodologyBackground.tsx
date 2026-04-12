"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const scrollingImages = [
  { bg: "/savehour.jpg" },
  { bg: "/delight%20client.jpg" },
  { bg: "/secure.jpg" },
  { bg: "/work%20for%20every%20event%20.jpg" },
];

export default function MethodologyBackground() {
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cardIndex = parseInt(entry.target.getAttribute("data-index") || "0");
              
              // Fade out all layers
              scrollingImages.forEach((_, idx) => {
                const layer = document.querySelector(`.bg-layer-${idx}`) as HTMLElement;
                if (layer) {
                  gsap.to(layer, {
                    opacity: 0,
                    duration: 0.4,
                  });
                }
              });
              
              // Fade in current layer
              const currentLayer = document.querySelector(`.bg-layer-${cardIndex}`) as HTMLElement;
              if (currentLayer) {
                gsap.to(currentLayer, {
                  opacity: 0.6,
                  duration: 0.4,
                });
              }

              // Find the features container and get all rows
              const featuresContainer = document.querySelector(".features-container");
              if (featuresContainer) {
                const featureRows = featuresContainer.querySelectorAll(".feature-row");
                
                if (featureRows[cardIndex]) {
                  const currentRow = featureRows[cardIndex] as HTMLElement;
                  const titleDiv = currentRow.querySelector(".feature-title") as HTMLElement;
                  const descDiv = currentRow.querySelector(".feature-description") as HTMLElement;

                  // Kill any existing animations on these elements
                  if (titleDiv) gsap.killTweensOf(titleDiv);
                  if (descDiv) gsap.killTweensOf(descDiv);

                  // Animate title - move UP and disappear
                  if (titleDiv) {
                    gsap.to(titleDiv, 
                      { 
                        y: -100,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                      }
                    );
                  }

                  // Animate description - move UP from below
                  if (descDiv) {
                    gsap.fromTo(descDiv, 
                      { 
                        y: 100,
                        opacity: 0,
                      },
                      {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        delay: 0.1,
                      }
                    );
                  }
                }
              }
            }
          });
        },
        {
          threshold: 0.5,
          root: null,
        }
      );

      // Observe all cards
      const cards = document.querySelectorAll(".individual-image-card");
      cards.forEach((card) => {
        observer.observe(card);
      });

      return () => {
        cards.forEach((card) => {
          observer.unobserve(card);
        });
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
