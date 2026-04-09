"use client";

import { useState } from "react";

const channels = [
  { icon: "📱", label: "WhatsApp", value: "+91 99837 45802", href: "https://wa.me/919983745802" },
  { icon: "📧", label: "Email", value: "support@goldenfocus.ai", href: "mailto:support@goldenfocus.ai" },
  { icon: "📍", label: "Location", value: "Rajasthan, India", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-[10vh]">

      {/* LEFT — Info side (dark) */}
      <div className="w-full md:w-1/2 bg-black flex flex-col justify-center px-10 py-16 md:py-0 min-h-[50vh] md:min-h-[90vh]">
        <p className="font-pixel text-yellow-400 text-xs tracking-widest uppercase mb-4">Get In Touch</p>
        <h1 className="font-pixel text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
          WE&apos;RE HERE<br />
          <span className="text-yellow-400">TO HELP</span>
        </h1>
        <p className="text-white/50 text-base max-w-sm mb-12 leading-relaxed">
          Have a question, feedback, or need support? Reach out — we respond fast.
        </p>

        <div className="flex flex-col gap-6">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 group">
              <span className="text-2xl w-10">{c.icon}</span>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wide mb-0.5">{c.label}</p>
                <p className="text-white group-hover:text-yellow-400 transition-colors text-sm font-medium">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* RIGHT — Form side (yellow) */}
      <div className="w-full md:w-1/2 bg-yellow-400 flex flex-col justify-center px-10 py-16 md:py-0 min-h-[50vh] md:min-h-[90vh]">
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <span className="text-5xl">✅</span>
            <h2 className="font-pixel text-2xl text-black">Message Sent!</h2>
            <p className="text-black/60 text-sm">We&apos;ll get back to you within 24 hours.</p>
            <button onClick={() => setSent(false)}
              className="mt-4 px-6 py-2 border-2 border-black text-black font-pixel text-xs hover:bg-black hover:text-yellow-400 transition-colors">
              Send Another
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-pixel text-2xl text-black mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-black/50 uppercase tracking-wide font-medium">Name</label>
                  <input value={form.name} onChange={set("name")} placeholder="Your name" required
                    className="bg-yellow-300 border-b-2 border-black/20 px-0 py-2 text-black text-sm focus:border-black focus:outline-none placeholder-black/30 bg-transparent" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-black/50 uppercase tracking-wide font-medium">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required
                    className="bg-yellow-300 border-b-2 border-black/20 px-0 py-2 text-black text-sm focus:border-black focus:outline-none placeholder-black/30 bg-transparent" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-black/50 uppercase tracking-wide font-medium">Subject</label>
                <input value={form.subject} onChange={set("subject")} placeholder="How can we help?" required
                  className="border-b-2 border-black/20 px-0 py-2 text-black text-sm focus:border-black focus:outline-none placeholder-black/30 bg-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-black/50 uppercase tracking-wide font-medium">Message</label>
                <textarea value={form.message} onChange={set("message")} placeholder="Tell us more..." rows={5} required
                  className="border-b-2 border-black/20 px-0 py-2 text-black text-sm focus:border-black focus:outline-none placeholder-black/30 bg-transparent resize-none" />
              </div>
              <button type="submit"
                className="mt-2 py-3 bg-black text-yellow-400 font-pixel text-sm hover:bg-black/80 transition-colors">
                Send Message →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
