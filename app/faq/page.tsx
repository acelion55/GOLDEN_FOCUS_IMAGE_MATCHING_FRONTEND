"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Getting Started",
    icon: "🚀",
    faqs: [
      { q: "How do I sign up as a photographer?", a: "Click 'Get Started' on the home page, fill in your details, and submit. Our team reviews and approves accounts within 24 hours." },
      { q: "Is GoldenFocus AI free to use?", a: "Yes! The Starter plan is completely free — up to 3 events and 500 photos per event. Upgrade anytime for more capacity." },
      { q: "What types of events does it work for?", a: "Any event with people — weddings, marathons, school events, corporate gatherings, sports events, graduations, and more." },
    ],
  },
  {
    title: "Face Recognition",
    icon: "🤖",
    faqs: [
      { q: "How accurate is the face matching?", a: "Our AI achieves 95%+ accuracy in well-lit conditions. Accuracy improves with clear, front-facing photos." },
      { q: "What if a customer isn't found?", a: "They can try again with a clearer selfie. We recommend a well-lit, front-facing photo without sunglasses." },
      { q: "How long does photo processing take?", a: "Most photos are processed within 2-5 minutes after upload. Large batches (1000+ photos) may take up to 15 minutes." },
    ],
  },
  {
    title: "Privacy & Security",
    icon: "🔒",
    faqs: [
      { q: "Is customer face data stored?", a: "No. Face data is processed in real-time and immediately discarded. We never store biometric data permanently." },
      { q: "Can customers see other people's photos?", a: "Never. Each customer only sees photos they personally appear in — nothing else is accessible." },
      { q: "Are my uploaded photos secure?", a: "Yes. Photos are stored on encrypted cloud storage with access controls. Only you and your customers can access them." },
    ],
  },
  {
    title: "Billing & Plans",
    icon: "💳",
    faqs: [
      { q: "Can I cancel my subscription anytime?", a: "Yes, cancel anytime from your dashboard. No cancellation fees, no questions asked." },
      { q: "What happens to my data if I cancel?", a: "Your photos and events remain accessible for 30 days after cancellation, giving you time to download everything." },
      { q: "Do you offer refunds?", a: "Yes — if you're not satisfied within the first 7 days of a paid plan, we'll issue a full refund." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div className="border border-white/10 bg-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-white text-sm font-medium">{q}</span>
        <span className={`text-yellow-400 font-pixel text-lg transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p className="px-6 pb-4 text-white/50 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

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

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-black/80 text-white pt-[10vh]">

      {/* STAGE 1 — Hero */}
      <section className="sticky top-[10vh] z-0 h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-black/90 border-b border-white/10">
        <p className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">FAQ</p>
        <h1 className="font-pixel text-5xl sm:text-7xl text-white leading-tight mb-6">
          GOT<br /><span className="text-yellow-400">QUESTIONS?</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl">
          Everything you need to know about GoldenFocus AI. Can&apos;t find your answer? Contact us.
        </p>
      </section>

      {/* STAGE 2 — FAQ Categories */}
      {categories.map((cat, i) => (
        <section
          key={cat.title}
          className={`${i % 2 === 0 ? "relative z-10 bg-black/95" : "sticky top-[10vh] z-10 bg-black/90"} border-b border-white/10 px-6 py-24`}
          style={{ zIndex: 10 + i }}
        >
          <AnimatedSection className="max-w-3xl mx-auto">
            <div data-anim className="flex items-center gap-3 mb-10">
              <span className="text-3xl">{cat.icon}</span>
              <h2 className="font-pixel text-xl text-yellow-400">{cat.title}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {cat.faqs.map((f) => (
                <div data-anim key={f.q}>
                  <FaqItem q={f.q} a={f.a} />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      ))}

      {/* CTA */}
      <section className="relative z-20 bg-black/95 px-6 py-32 flex flex-col items-center text-center">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-2xl text-white mb-4">Still have questions?</h2>
          <p data-anim className="text-white/60 mb-8 max-w-md">Our team is happy to help. Reach out anytime.</p>
          <div data-anim className="flex gap-4 flex-wrap justify-center">
            <Link href="/contact" className="px-8 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
              Contact Us
            </Link>
            <a href="https://wa.me/919983745802" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 border border-yellow-400/40 text-white text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
