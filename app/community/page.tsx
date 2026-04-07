"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: "💬", title: "Photographer Forum", desc: "Ask questions, share tips, and learn from photographers across India." },
  { icon: "📚", title: "Tutorials & Guides", desc: "Step-by-step guides on getting the most out of GoldenFocus AI." },
  { icon: "🏆", title: "Monthly Showcases", desc: "Share your best event photos and get featured on our platform." },
  { icon: "🔔", title: "Early Access", desc: "Community members get first access to new features before anyone else." },
];

const testimonials = [
  { name: "Ravi Sharma", role: "Wedding Photographer, Jaipur", text: "GoldenFocus AI saved me 6+ hours after every wedding. My clients love getting their photos instantly.", emoji: "👨🎤" },
  { name: "Priya Mehta", role: "Event Photographer, Mumbai", text: "The face matching is incredibly accurate. Even in a crowd of 500 people, it finds the right photos.", emoji: "👩🎨" },
  { name: "Arjun Patel", role: "Sports Photographer, Ahmedabad", text: "I use it for marathon events. 2000 runners, and every single person gets their photos in minutes.", emoji: "🏃" },
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

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black/80 text-white pt-[10vh]">

      {/* STAGE 1 — Hero */}
      <section className="sticky top-[10vh] z-0 h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-black/90 border-b border-white/10">
        <p className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">Community</p>
        <h1 className="font-pixel text-5xl sm:text-7xl text-white leading-tight mb-6">
          JOIN 1000+<br /><span className="text-yellow-400">PHOTOGRAPHERS</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mb-8">
          Connect with photographers across India. Share, learn, and grow together.
        </p>
        <Link href="/#signup" className="px-8 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
          Join the Community
        </Link>
      </section>

      {/* STAGE 2 — Benefits */}
      <section className="relative z-10 bg-black/95 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-5xl mx-auto">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-16">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div data-anim key={b.title} className="flex gap-4 p-6 border border-white/10 bg-white/5 rounded-xl">
                <span className="text-3xl shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-pixel text-sm text-white mb-2">{b.title}</h3>
                  <p className="text-white/50 text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 3 — Testimonials (sticky) */}
      <section className="sticky top-[10vh] z-10 bg-black/90 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-5xl mx-auto">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-16">What Photographers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div data-anim key={t.name} className="border border-white/10 bg-white/5 p-6 rounded-xl flex flex-col gap-4">
                <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 4 — CTA */}
      <section className="relative z-20 bg-black/95 px-6 py-32 flex flex-col items-center text-center">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-3xl text-white mb-4">Ready to Join?</h2>
          <p data-anim className="text-white/60 mb-8 max-w-md">Create your free account and become part of the GoldenFocus AI community.</p>
          <Link data-anim href="/#signup" className="px-10 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
            Get Started Free
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
