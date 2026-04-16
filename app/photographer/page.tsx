"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  { icon: "📸", title: "Bulk Photo Upload", desc: "Upload hundreds of event photos at once. Our system processes them automatically in the background." },
  { icon: "🤖", title: "AI Face Indexing", desc: "Every face in every photo is detected and indexed automatically — no manual tagging, no sorting." },
  { icon: "🔗", title: "Event Share Links", desc: "Each event gets a unique link. Share it with attendees and they find their photos instantly." },
  { icon: "📊", title: "Analytics Dashboard", desc: "See how many customers visited, searched, and downloaded their photos in real time." },
  { icon: "🔒", title: "Secure & Private", desc: "Photos are stored securely. Customers only see photos they appear in — nothing else." },
  { icon: "⚡", title: "Instant Results", desc: "Face matching happens in seconds. Customers get their photos without waiting." },
];

const steps = [
  { n: "01", title: "Sign Up & Get Approved", desc: "Create your photographer account. Our team reviews and approves you within 24 hours." },
  { n: "02", title: "Create an Event", desc: "Add event details — name, date, venue, client name, and your Google Drive link." },
  { n: "03", title: "Upload Photos", desc: "Upload all event photos. AI processes and indexes every face automatically." },
  { n: "04", title: "Share the Link", desc: "Copy the event link and send it to your clients via WhatsApp, email, or any channel." },
  { n: "05", title: "Clients Find Themselves", desc: "Clients open the link, take a selfie, and instantly see all photos they appear in." },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    gsap.fromTo(el.querySelectorAll("[data-anim]"),
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power3.out",
        scrollTrigger: { 
          trigger: el, 
          start: "top 80%", 
          once: true 
        },
      }
    );
  }, []);
  
  return <div ref={ref} className={className}>{children}</div>;
}

export default function PhotographerPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Hero stage animation
      const tl = gsap.timeline();
      
      tl.from(".hero-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      .from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-buttons", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pt-[10vh]">

      {/* STAGE 1 — Hero */}
      <section ref={heroRef} className="min-h-[90vh] flex flex-col items-center justify-center text-center px-[5vw] bg-white">
        <p className="hero-badge text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
          For Photographers
        </p>
        <h1 className="hero-title text-[48px] sm:text-[64px] lg:text-[80px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
          YOUR PHOTOS.<br />
          <span className="text-[#a3925d]">YOUR CLIENTS.</span><br />
          INSTANTLY.
        </h1>
        <p className="hero-subtitle text-[16px] lg:text-[20px] text-[#666666] max-w-[600px] mb-[5vh] leading-relaxed">
          Stop spending hours sorting and sending photos. GoldenFocus AI does it all — automatically.
        </p>
        <div className="hero-buttons flex gap-[2vw] flex-wrap justify-center">
          <Link href="/#signup" className="px-[3vw] py-[2vh] bg-[#1a1a1a] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#a3925d] transition-colors duration-300">
            Start Free
          </Link>
          <Link href="/pricing" className="px-[3vw] py-[2vh] border-2 border-[#1a1a1a] text-[#1a1a1a] text-[16px] lg:text-[18px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-all duration-300">
            View Pricing
          </Link>
        </div>
      </section>

      {/* STAGE 2 — Features */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Everything You Need
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                Powerful Features
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4vw]">
              {features.map((f) => (
                <div data-anim key={f.title} className="bg-white p-[3vw] border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-[48px] mb-[2vh]">{f.icon}</div>
                  <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1a1a1a] mb-[1.5vh]">{f.title}</h3>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 3 — How it works */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1000px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Simple Process
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                How It Works
              </h2>
            </div>
            
            <div className="space-y-[4vh]">
              {steps.map((s) => (
                <div data-anim key={s.n} className="flex gap-[3vw] items-start bg-gray-50 p-[3vw] border-l-4 border-[#a3925d]">
                  <div className="w-[60px] h-[60px] bg-[#a3925d] text-white text-[20px] font-bold flex items-center justify-center shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1a1a1a] mb-[1vh]">{s.title}</h3>
                    <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 4 — CTA */}
      <section className="bg-[#1a1a1a] text-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[800px] mx-auto text-center">
            <h2 data-anim className="text-[36px] lg:text-[48px] font-serif mb-[3vh]">
              Ready to Get Started?
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-white/80 mb-[5vh] leading-relaxed">
              Join photographers already using GoldenFocus AI to delight their clients.
            </p>
            <Link data-anim href="/#signup" className="inline-block px-[4vw] py-[2.5vh] bg-[#a3925d] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#b8a76b] transition-colors duration-300">
              Create Free Account
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}