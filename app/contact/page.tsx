"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const channels = [
  { icon: "📱", title: "WhatsApp", desc: "Chat with us directly", value: "+91 99837 45802", href: "https://wa.me/919983745802" },
  { icon: "📧", title: "Email", desc: "We reply within 24 hours", value: "support@goldenfocus.ai", href: "mailto:support@goldenfocus.ai" },
  { icon: "📍", title: "Location", desc: "Based in India", value: "Rajasthan, India", href: "#" },
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

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to an API
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-black/80 text-white pt-[10vh]">

      {/* STAGE 1 — Hero */}
      <section className="sticky top-[10vh] z-0 h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-black/90 border-b border-white/10">
        <p className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">Get In Touch</p>
        <h1 className="font-pixel text-5xl sm:text-7xl text-white leading-tight mb-6">
          WE&apos;RE HERE<br /><span className="text-yellow-400">TO HELP</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl">
          Have a question, feedback, or need support? Reach out — we respond fast.
        </p>
      </section>

      {/* STAGE 2 — Channels */}
      <section className="relative z-10 bg-black/95 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-4xl mx-auto">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-12">Contact Channels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {channels.map((c) => (
              <a data-anim key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
                className="border border-white/10 bg-white/5 p-6 rounded-xl flex flex-col gap-3 hover:border-yellow-400/40 transition-colors group">
                <span className="text-3xl">{c.icon}</span>
                <h3 className="font-pixel text-sm text-white">{c.title}</h3>
                <p className="text-white/40 text-xs">{c.desc}</p>
                <p className="text-yellow-400 text-sm group-hover:underline">{c.value}</p>
              </a>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* STAGE 3 — Contact Form (sticky) */}
      <section className="sticky top-[10vh] z-10 bg-black/90 border-b border-white/10 px-6 py-24">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 data-anim className="font-pixel text-2xl text-yellow-400 text-center mb-12">Send a Message</h2>
          {sent ? (
            <div data-anim className="border border-yellow-400/40 bg-yellow-400/5 p-8 rounded-xl text-center">
              <p className="font-pixel text-yellow-400 text-lg mb-2">Message Sent!</p>
              <p className="text-white/60 text-sm">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div data-anim className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40 uppercase tracking-wide">Name</label>
                  <input value={form.name} onChange={set("name")} placeholder="Your name" required
                    className="bg-white/5 border border-white/10 px-4 py-3 text-white text-sm rounded-lg focus:border-yellow-400 focus:outline-none placeholder-white/20" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40 uppercase tracking-wide">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required
                    className="bg-white/5 border border-white/10 px-4 py-3 text-white text-sm rounded-lg focus:border-yellow-400 focus:outline-none placeholder-white/20" />
                </div>
              </div>
              <div data-anim className="flex flex-col gap-1">
                <label className="text-xs text-white/40 uppercase tracking-wide">Subject</label>
                <input value={form.subject} onChange={set("subject")} placeholder="How can we help?" required
                  className="bg-white/5 border border-white/10 px-4 py-3 text-white text-sm rounded-lg focus:border-yellow-400 focus:outline-none placeholder-white/20" />
              </div>
              <div data-anim className="flex flex-col gap-1">
                <label className="text-xs text-white/40 uppercase tracking-wide">Message</label>
                <textarea value={form.message} onChange={set("message")} placeholder="Tell us more..." rows={5} required
                  className="bg-white/5 border border-white/10 px-4 py-3 text-white text-sm rounded-lg focus:border-yellow-400 focus:outline-none placeholder-white/20 resize-none" />
              </div>
              <button data-anim type="submit"
                className="py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors rounded-lg">
                Send Message
              </button>
            </form>
          )}
        </AnimatedSection>
      </section>
    </div>
  );
}
