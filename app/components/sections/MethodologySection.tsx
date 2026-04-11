"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const methodologySteps = [
  { number: "01", title: "Create & Upload", desc: "Simply upload your full event gallery. Our high-speed servers handle bulk RAW or JPEG processing in minutes.", emoji: "📸" },
  { number: "02", title: "AI Face Indexing", desc: "Our proprietary neural networks map every face, creating a private, searchable index for each unique guest.", emoji: "🤖" },
  { number: "03", title: "Instant Delivery", desc: "Clients take a selfie and instantly see only their photos. No more scrolling through thousands of images.", emoji: "📱" },
];

export default function MethodologySection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full h-[140vh] mt-15vh sticky -top-40 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-[#6b7a8f]">
      <p className="text-xs font-pixel text-yellow-400 mb-[2vh] tracking-widest uppercase">The Methodology</p>
      <h2 className="font-pixel text-[2.5vw] md:text-[3.5vw] text-white mb-[6vh] text-center">The Golden Standard Workflow</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2vw] w-full max-w-[90vw]">
        {methodologySteps.map((step, idx) => (
          <div key={step.number} ref={(el) => { cardsRef.current[idx] = el; }} className="flex flex-col">
            <div className="relative w-full aspect-square mb-[2vh] overflow-hidden border border-white/10 bg-gradient-to-br from-yellow-400/10 to-transparent backdrop-blur rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-[6vw] md:text-[7vw] mb-[1vh]">{step.emoji}</div>
                <p className="text-white/40 text-[0.9vw] md:text-[1.1vw]">{step.title}</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-[1vw] mb-[1vh]">
                <span className="font-pixel text-[2vw] md:text-[2.5vw] text-yellow-400/40">{step.number}</span>
                <h3 className="font-pixel text-[1.3vw] md:text-[1.8vw] text-white">{step.title}</h3>
              </div>
              <p className="text-white/50 text-[0.9vw] md:text-[1.1vw] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
