"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const methodologySteps = [
  { number: "01", title: "Create & Upload", desc: "Simply upload your full event gallery. Our high-speed servers handle bulk RAW or JPEG processing in minutes.", img: "/01.jpg" },
  { number: "02", title: "AI Face Indexing", desc: "Our proprietary neural networks map every face, creating a private, searchable index for each unique guest.", img: "/02.jpg" },
  { number: "03", title: "Instant Delivery", desc: "Clients take a selfie and instantly see only their photos. No more scrolling through thousands of images.", img: "/03.jpg" },
];

const features = [
  { title: "Save Hours of Work", desc: "Automate selection and sorting. Less desk time, more shooting.", icon: "s" },
  { title: "Delight Your Clients", desc: "Instant gratification with modern photo delivery.", icon: "x" },
  { title: "Secure & Private", desc: "Bank-grade encryption and auto-deletion policies.", icon: "x" },
  { title: "Works for Any Event", desc: "From corporate mixers to massive music festivals.", icon: "s" },
];

export default function MethodologySection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".method-card", {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".method-grid",
          start: "top 85%",
        }
      });

      gsap.from(".feature-row", {
        x: -50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        scrollTrigger: {
          trigger: ".why-section",
          start: "top 70%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-white text-[#1a1a1a]">
      
      {/* --- PART 1: THE METHODOLOGY --- */}
      <div className="w-full min-h-[120vh] flex flex-col items-center pt-[8vh] ">
        <div className="w-full max-w-[1400px] px-[5vw]">
          <p className="text-[0.7vw] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[1.5vh]">The Methodology</p>
          <h2 className="text-[3.5vw] font-serif mb-[8vh] leading-tight">The Golden Standard Workflow</h2>
          
          <div className="method-grid grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
            {methodologySteps.map((step) => (
              <div key={step.number} className="method-card flex flex-col group">
                <div className="relative w-full aspect-[4/5] mb-[2.5vh] overflow-hidden bg-gray-100 shadow-sm">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-start gap-[1vw]">
                  <span className="text-[2vw] font-serif text-[#dcd6c5] leading-none">{step.number}</span>
                  <div>
                    <h3 className="text-[1.2vw] font-bold mb-[0.8vh]">{step.title}</h3>
                    <p className="text-[0.85vw] text-[#666666] leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- PART 2: WHY GOLDENFOCUS AI? --- */}
      <div className="why-section w-full min-h-[200vh] py-[10vh] px-[2vw] bg-[#fcfcfc]">
        <div className="w-full max-w-[1400px] mx-auto">
          
          {/* Main Flex Container: ensures items start at the top */}
          <div className="flex flex-col lg:flex-row gap-[6vw] items-start">

            {/* LEFT SIDE: STICKY TEXT BLOCK */}
            <div className="flex-[1.2] lg:sticky lg:top-[10vh] w-full">
              <p className="text-[0.7vw] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[1.5vh]">Excellence Defined</p>
              <h2 className="text-[3.5vw] font-serif mb-[6vh] leading-tight">Why GoldenFocus AI?</h2>
              
              <div className="flex flex-col border-t border-black w-full">
                {features.map((item, i) => (
                  <div 
                    key={i} 
                    className="feature-row flex flex-col justify-center border-b border-black py-[2vh] group transition-all duration-500 ease-in-out"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-[1.5vw]">
                        <span className="text-[1.2vw] opacity-40 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                        <h4 className="text-[4.3rem] font-bold leading-none tracking-tighter group-hover:text-[#a3925d] transition-colors duration-300">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-[20vh] group-hover:opacity-100 group-hover:mt-[2vh] transition-all duration-500 ease-in-out">
                      <p className="text-[1vw] text-[#666666] max-w-[30vw] font-light ml-[3vw]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: SCROLLING IMAGES/CONTENT */}
            <div className="flex-1 w-full space-y-[10vh] pt-[20vh]">
              {/* Box 1 */}
              <div className="w-full aspect-[5/3] overflow-hidden rounded-sm shadow-2xl relative bg-gray-100">
                <div className="absolute -bottom-[4vh] -left-[2vw] bg-white/95 backdrop-blur-md p-[2vw] shadow-2xl max-w-[18vw] border border-black z-10">
                  <p className="italic text-[1vw] font-serif text-[#1a1a1a] mb-[2vh] leading-relaxed">
                    "The first tool that actually changed how I market myself. My clients are obsessed."
                  </p>
                  <div className="flex flex-col">
                    <span className="text-[0.6vw] font-bold tracking-[0.2em] uppercase text-[#a3925d]">— Julian R.</span>
                  </div>
                </div>
              </div>

              {/* Box 2 (Extra images add to the scroll depth) */}
              <div className="w-full aspect-[5/3] bg-gray-200 rounded-sm shadow-xl"></div>
              <div className="w-full aspect-[5/3] bg-gray-300 rounded-sm shadow-xl"></div>
              
              <div className="h-[20vh]" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}