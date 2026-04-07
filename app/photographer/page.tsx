"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      }
    );
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function PhotographerPage() {
  return (
    <div className="min-h-screen bg-black/80 text-white pt-[10vh]">

      {/* STAGE 1 — Hero (sticky) */}
      <section className="sticky top-[10vh] z-0 h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-black/90 border-b border-white/10">
        <p data-anim className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">For Photographers</p>
        <h1 className="font-pixel text-4xl sm:text-6xl lg:text-8xl text-white leading-tight mb-6">
          YOUR PHOTOS.<br /><span className="text-yellow-400">YOUR CLIENTS.</span><br />INSTANTLY.
        </h1>
        <p className="text-white/60 text-lg max-w-xl mb-8">
          Stop spending hours sorting and sending photos. GoldenFocus AI does it all — automatically.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/#signup" className="px-8 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
            Start Free
          </Link>
          <Link href="/pricing" className="px-8 py-3 border border-yellow-400/40 text-white text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors">
            View Pricing
          </Link>
        </div>
      </section>

      {/* STAGE 2 — Features (scrolls over hero) */}
      <section className="relative z-10 bg-black/95 border-b border-white/10 px-6 py-24">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-16">Everything You Need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f) => (
              <div data-anim key={f.title} className="border border-white/10 bg-white/5 backdrop-blur p-6 rounded-xl flex flex-col gap-3">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-pixel text-sm text-white">{f.title}</h3>
                <p className="text-white/50 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 3 — How it works (sticky) */}
      <section className="sticky top-[10vh] z-10 bg-black/90 border-b border-white/10 px-6 py-24">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-16">How It Works</h2>
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {steps.map((s) => (
              <div data-anim key={s.n} className="flex gap-6 items-start border border-white/10 bg-white/5 p-6 rounded-xl">
                <span className="font-pixel text-yellow-400 text-2xl shrink-0">{s.n}</span>
                <div>
                  <h3 className="font-pixel text-sm text-white mb-1">{s.title}</h3>
                  <p className="text-white/50 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 4 — CTA */}
      <section className="relative z-20 bg-black/95 px-6 py-32 flex flex-col items-center text-center">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-3xl text-white mb-4">Ready to Get Started?</h2>
          <p data-anim className="text-white/60 mb-8 max-w-md">Join photographers already using GoldenFocus AI to delight their clients.</p>
          <Link data-anim href="/#signup" className="px-10 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
            Create Free Account
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
