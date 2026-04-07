"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { icon: "🎯", title: "Accuracy First", desc: "Our AI is trained on millions of faces to deliver precise matches even in large crowds." },
  { icon: "🔒", title: "Privacy by Design", desc: "Face data is never stored permanently. We process and discard — your clients stay safe." },
  { icon: "⚡", title: "Speed Matters", desc: "From upload to delivery in minutes. We built for photographers who value their time." },
  { icon: "🤝", title: "Photographer-First", desc: "Every feature is built based on real feedback from working photographers." },
];

const team = [
  { name: "Harshvardhan", role: "Founder & CEO", emoji: "👨‍💻" },
  { name: "AI Team", role: "Face Recognition", emoji: "🤖" },
  { name: "Design Team", role: "UX & Product", emoji: "🎨" },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el.querySelectorAll("[data-anim]"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true } }
    );
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black/80 text-white pt-[10vh]">

      {/* STAGE 1 — Hero */}
      <section className="sticky top-[10vh] z-0 h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-black/90 border-b border-white/10">
        <p className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">Our Story</p>
        <h1 className="font-pixel text-5xl sm:text-7xl text-white leading-tight mb-6">
          BUILT FOR<br /><span className="text-yellow-400">PHOTOGRAPHERS</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl">
          GoldenFocus AI was born from a simple frustration — photographers spending days sorting and sending photos after every event. We built the solution.
        </p>
      </section>

      {/* STAGE 2 — Mission */}
      <section className="relative z-10 bg-black/95 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 data-anim className="font-pixel text-2xl text-yellow-400 mb-6">Our Mission</h2>
              <p data-anim className="text-white/70 text-lg leading-relaxed mb-4">
                We believe photographers should spend their time behind the lens — not behind a computer sorting thousands of photos.
              </p>
              <p data-anim className="text-white/50 leading-relaxed">
                GoldenFocus AI automates the entire photo delivery process using face recognition. Upload once, share a link, and let your clients find themselves instantly.
              </p>
            </div>
            <div data-anim className="border border-white/10 bg-white/5 p-8 rounded-xl text-center">
              <p className="font-pixel text-yellow-400 text-5xl mb-2">10x</p>
              <p className="text-white/60">Faster photo delivery</p>
              <div className="border-t border-white/10 my-6" />
              <p className="font-pixel text-yellow-400 text-5xl mb-2">100%</p>
              <p className="text-white/60">Automated face matching</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 3 — Values (sticky) */}
      <section className="sticky top-[10vh] z-10 bg-black/90 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-5xl mx-auto">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div data-anim key={v.title} className="flex gap-4 p-6 border border-white/10 bg-white/5 rounded-xl">
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-pixel text-sm text-white mb-2">{v.title}</h3>
                  <p className="text-white/50 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 4 — Team */}
      <section className="relative z-20 bg-black/95 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 mb-16">The Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((t) => (
              <div data-anim key={t.name} className="border border-white/10 bg-white/5 p-8 rounded-xl w-48 flex flex-col items-center gap-3">
                <span className="text-5xl">{t.emoji}</span>
                <p className="font-pixel text-sm text-white">{t.name}</p>
                <p className="text-white/40 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 5 — CTA */}
      <section className="relative z-20 bg-black/95 px-6 py-32 flex flex-col items-center text-center">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-3xl text-white mb-4">Join the Movement</h2>
          <p data-anim className="text-white/60 mb-8 max-w-md">Be part of the future of photography delivery.</p>
          <Link data-anim href="/#signup" className="px-10 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
            Get Started Free
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
