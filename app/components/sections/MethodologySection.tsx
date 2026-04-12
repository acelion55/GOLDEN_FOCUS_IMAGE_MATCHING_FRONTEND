"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WhyGoldenFocusFeatures from "./WhyGoldenFocusFeatures";
import MethodologyBackground from "./MethodologyBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const methodologySteps = [
  { number: "01", title: "Create & Upload", desc: "Simply upload your full event gallery. Our high-speed servers handle bulk RAW or JPEG processing in minutes.", img: "/01.jpg" },
  { number: "02", title: "AI Face Indexing", desc: "Our proprietary neural networks map every face, creating a private, searchable index for each unique guest.", img: "/02.jpg" },
  { number: "03", title: "Instant Delivery", desc: "Clients take a selfie and instantly see only their photos. No more scrolling through thousands of images.", img: "/03.jpg" },
];

const scrollingImages = [
  { src: "/savehour.jpg", alt: "Save Hours" },
  { src: "/delight%20client.jpg", alt: "Delight Clients" },
  { src: "/secure.jpg", alt: "Secure" },
  { src: "/work%20for%20every%20event%20.jpg", alt: "Events" },
];

export default function MethodologySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const whySectionRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const whySection = whySectionRef.current;
      const imagesContainer = imagesContainerRef.current;
      if (!whySection || !imagesContainer) return;

      // Pin the section
      ScrollTrigger.create({
        trigger: whySection,
        start: "top top",
        end: "+=4000",
        pin: true,
        pinSpacing: true,
      });

      // Scroll images container down
      gsap.to(".scrolling-images-container", {
        y: -1500,
        ease: "none",
        scrollTrigger: {
          trigger: whySection,
          start: "top top",
          end: "+=4000",
          scrub: 1,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-white text-[#1a1a1a] relative">

      {/* Methodology Section */}
      <div className="w-full min-h-screen flex flex-col items-center pt-[8vh] pb-[10vh]">
        <div className="w-full max-w-[1400px] px-[5vw]">
          <p className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[1.5vh]">The Methodology</p>
          <h2 className="text-[32px] lg:text-[48px] font-serif mb-[8vh] leading-tight text-[#1a1a1a]">The Golden Standard Workflow</h2>
          <div className="method-grid grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
            {methodologySteps.map((step) => (
              <div key={step.number} className="method-card flex flex-col">
                <div className="relative w-full aspect-[4/5] mb-[2.5vh] overflow-hidden bg-gray-100">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-start gap-[1vw]">
                  <span className="text-[24px] lg:text-[32px] font-serif text-[#dcd6c5]">{step.number}</span>
                  <div>
                    <h3 className="text-[18px] lg:text-[20px] font-bold mb-[0.8vh]">{step.title}</h3>
                    <p className="text-[14px] lg:text-[16px] text-[#666666]">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned Section */}
      <div ref={whySectionRef} className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">

        {/* Background Layers */}
        <MethodologyBackground />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-[6vw] items-start px-[5vw] py-[10vh]">
          {/* Left: Features */}
          <div className="flex-[1.2] w-full">
            <WhyGoldenFocusFeatures />
          </div>

          {/* Right: Scrolling Images */}
          <div className="flex-1 w-full h-[80vh] overflow-hidden relative self-center">
            <div ref={imagesContainerRef} className="scrolling-images-container space-y-[20vh] pt-[30vh]">
              {scrollingImages.map((image, i) => (
                <div
                  key={i}
                  data-index={i}
                  className="individual-image-card w-full aspect-[4/5] lg:aspect-[5/3] overflow-hidden rounded-md shadow-2xl bg-zinc-900"
                >
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
