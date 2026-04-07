"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever",
    highlight: false,
    features: [
      "Up to 3 events",
      "500 photos per event",
      "Basic face matching",
      "Customer share links",
      "Email support",
    ],
    cta: "Get Started",
    href: "/#signup",
  },
  {
    name: "Pro",
    price: "₹999",
    sub: "per month",
    highlight: true,
    features: [
      "Unlimited events",
      "5,000 photos per event",
      "Advanced AI face matching",
      "Google Drive integration",
      "Analytics dashboard",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Pro",
    href: "/#signup",
  },
  {
    name: "Studio",
    price: "₹2,499",
    sub: "per month",
    highlight: false,
    features: [
      "Everything in Pro",
      "Unlimited photos",
      "Multiple team members",
      "White-label portal",
      "API access",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Us",
    href: "/contact",
  },
];

const faqs = [
  { q: "Is there a free trial?", a: "Yes — the Starter plan is completely free forever with up to 3 events." },
  { q: "Can I upgrade anytime?", a: "Absolutely. Upgrade or downgrade your plan at any time from your dashboard." },
  { q: "How does billing work?", a: "Plans are billed monthly. Cancel anytime — no long-term contracts." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, and net banking." },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el.querySelectorAll("[data-anim]"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true } }
    );
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black/80 text-white pt-[10vh]">

      {/* STAGE 1 — Hero */}
      <section className="sticky top-[10vh] z-0 h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-black/90 border-b border-white/10">
        <p className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">Simple Pricing</p>
        <h1 className="font-pixel text-5xl sm:text-7xl text-white leading-tight mb-6">
          PAY FOR<br /><span className="text-yellow-400">WHAT YOU USE</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl">
          Start free. Scale as you grow. No hidden fees, no surprises.
        </p>
      </section>

      {/* STAGE 2 — Plans */}
      <section className="relative z-10 bg-black/95 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                data-anim
                key={p.name}
                className={`flex flex-col p-8 rounded-xl border ${
                  p.highlight
                    ? "border-yellow-400 bg-yellow-400/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {p.highlight && (
                  <span className="font-pixel text-xs text-black bg-yellow-400 px-3 py-1 self-start mb-4">MOST POPULAR</span>
                )}
                <h3 className="font-pixel text-lg text-white mb-1">{p.name}</h3>
                <div className="mb-6">
                  <span className={`font-pixel text-4xl ${p.highlight ? "text-yellow-400" : "text-white"}`}>{p.price}</span>
                  <span className="text-white/40 text-sm ml-2">{p.sub}</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="text-yellow-400">▸</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`text-center py-3 font-pixel text-sm transition-colors ${
                    p.highlight
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "border border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 3 — FAQ (sticky) */}
      <section className="sticky top-[10vh] z-10 bg-black/90 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-3xl mx-auto">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-12">Pricing FAQ</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((f) => (
              <div data-anim key={f.q} className="border border-white/10 bg-white/5 p-6 rounded-xl">
                <p className="font-pixel text-sm text-white mb-2">{f.q}</p>
                <p className="text-white/50 text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 4 — CTA */}
      <section className="relative z-20 bg-black/95 px-6 py-32 flex flex-col items-center text-center">
        <AnimatedSection>
          <h2 data-anim className="font-pixel text-3xl text-white mb-4">Start for Free Today</h2>
          <p data-anim className="text-white/60 mb-8 max-w-md">No credit card required. Upgrade when you&apos;re ready.</p>
          <Link data-anim href="/#signup" className="px-10 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">
            Create Free Account
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
