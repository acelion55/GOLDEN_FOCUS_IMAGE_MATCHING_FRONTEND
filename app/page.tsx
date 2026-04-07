"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/lib/auth-context";
import Rotate from "../components/Rotate";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

const features = [
  { icon: "📸", title: "Upload Event Photos", desc: "Photographers upload bulk photos from weddings, sports events, graduations, and more." },
  { icon: "🤖", title: "AI Face Matching", desc: "Our AI scans and indexes every face in every photo automatically — no manual tagging needed." },
  { icon: "🔗", title: "Share a Link", desc: "Clients scan their face via a unique link and instantly receive all their photos." },
];

const benefits = [
  { title: "Save Hours of Work", desc: "No more manually sorting and sending photos. Upload once, let AI do the rest." },
  { title: "Delight Your Clients", desc: "Clients get their photos in seconds — a seamless, modern experience they'll remember." },
  { title: "Secure & Private", desc: "Face data is processed securely. Clients only see their own photos, nothing else." },
  { title: "Works for Any Event", desc: "Weddings, marathons, school events, corporate gatherings — any crowd, any size." },
];

const steps = [
  { step: "01", label: "Photographer signs up & gets approved" },
  { step: "02", label: "Creates an event & uploads photos" },
  { step: "03", label: "Shares a unique link with attendees" },
  { step: "04", label: "Clients scan face → get their photos instantly" },
];

function PinInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const r0 = useRef<HTMLInputElement>(null);
  const r1 = useRef<HTMLInputElement>(null);
  const r2 = useRef<HTMLInputElement>(null);
  const r3 = useRef<HTMLInputElement>(null);
  const refs = [r0, r1, r2, r3];

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = (value + "    ").slice(0, 4).split("");
    arr[i] = digit;
    onChange(arr.join("").trimEnd());
    if (digit && i < 3) refs[i + 1].current?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) refs[i - 1].current?.focus();
  }

  return (
    <div className="flex gap-3 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-yellow-400 focus:outline-none focus:bg-white/20 transition-all caret-transparent"
        />
      ))}
    </div>
  );
}

// mode: "idle" = show CTA button, "signup" = show signup form, "login" = show login form
type PanelMode = "idle" | "signup" | "login";

function HeroPanel() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "1" || searchParams.get("role") === "admin";

  const [mode, setMode] = useState<PanelMode>("idle");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const formRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Read hash/searchParams to set initial mode
  useEffect(() => {
    if (isAdmin) { setMode("login"); return; }
    const hash = window.location.hash.replace(/^#/, "");
    if (searchParams.get("mode") === "signup" || hash === "signup") { setMode("signup"); return; }
    if (hash === "login" || hash === "photographer-auth") { setMode("login"); return; }
    setMode("idle");
  }, [isAdmin, searchParams]);

  useEffect(() => {
    if (isAdmin) return;
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "signup") setMode("signup");
      else if (h === "login" || h === "photographer-auth") setMode("login");
      else setMode("idle");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [isAdmin]);

  // Animate form in/out
  useLayoutEffect(() => {
    const form = formRef.current;
    const cta = ctaRef.current;
    if (!form || !cta) return;

    if (mode === "idle") {
      gsap.killTweensOf([form, cta]);
      gsap.set(form, { display: "none", opacity: 0 });
      gsap.set(cta, { display: "flex", opacity: 1, y: 0 });
    } else {
      gsap.killTweensOf([form, cta]);
      gsap.set(cta, { display: "none" });
      gsap.set(form, { display: "flex" });
      gsap.fromTo(form, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    }
  }, [mode]);

  function resetForm() {
    setPhone(""); setPassword(""); setName(""); setBusinessName(""); setEmail(""); setError("");
  }

  function redirectAfterAuth(role: string) {
    if (role === "admin") router.push("/admin");
    else router.push("/dashboard");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!phone.trim()) { setError("Please enter your phone number"); return; }
    if (password.length !== 4) { setError("Please enter your 4-digit PIN"); return; }
    setIsLoading(true);
    const result = await login(phone.trim(), password.padEnd(8, "0"));
    if (result.success) redirectAfterAuth(result.user.role);
    else if (result.error?.includes("pending")) setError("Your account is under approval. Please contact 9983745802");
    else setError(result.error || "Login failed");
    setIsLoading(false);
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (password.length !== 4) { setError("Please enter your 4-digit PIN"); return; }
    setIsLoading(true);
    const result = await login(email.trim(), password.padEnd(8, "0"));
    if (result.success) redirectAfterAuth(result.user.role);
    else setError(result.error || "Login failed");
    setIsLoading(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your full name"); return; }
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (phone.replace(/\D/g, "").length < 10) { setError("Please enter a valid 10-digit phone number"); return; }
    if (password.length !== 4) { setError("PIN must be exactly 4 digits"); return; }
    setIsLoading(true);
    const result = await signup({ name, email, password: password.padEnd(8, "0"), businessName, phone });
    if (result.success) redirectAfterAuth(result.user.role);
    else setError(result.error || "Signup failed");
    setIsLoading(false);
  }

  function switchMode(next: PanelMode) {
    resetForm();
    setMode(next);
    const hash = next === "signup" ? "signup" : next === "login" ? "login" : "";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash ? "#" + hash : ""}`);
  }

  return (
    <div className="w-full xl:w-[min(30%,32rem)] xl:min-w-[22rem] shrink-0 flex items-center justify-center pt-4 pr-4">

      {/* CTA — shown when idle */}
      <div ref={ctaRef} className="flex flex-col items-start gap-4 w-full max-w-md">
        <p className="text-white/50 text-sm">Ready to grow your photography business?</p>
        <button
          onClick={() => switchMode("signup")}
          className="px-8 py-4 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 active:scale-95 transition-all"
        >
          Join as Photographer →
        </button>
      </div>

      {/* Form — shown when signup or login */}
      <div ref={formRef} style={{ display: "none" }} className="flex-col w-full max-w-md gap-1">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-pixel text-lg text-white">
            {isAdmin ? "Admin Login" : mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          {!isAdmin && (
            <button
              onClick={() => switchMode("idle")}
              className="text-white/30 hover:text-white/70 text-xl transition-colors leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 text-sm flex items-center gap-3 bg-red-500/10 text-red-300 border border-red-500/40 rounded-xl">
            <span>⚠</span><span>{error}</span>
          </div>
        )}

        {/* Admin login form */}
        {isAdmin && (
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4" noValidate>
            <FloatingLabelInput id="admin-email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            <input type="password" placeholder="4-Digit PIN *" value={password} maxLength={4}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))} required disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-yellow-400 focus:outline-none" />
            <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase">
              {isLoading ? "Please wait…" : "Login"}
            </Button>
          </form>
        )}

        {/* Signup form */}
        {!isAdmin && mode === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4" noValidate>
            <FloatingLabelInput id="s-name" label="Full name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            <FloatingLabelInput id="s-business" label="Business name (optional)" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} disabled={isLoading} />
            <FloatingLabelInput id="s-email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            <FloatingLabelInput id="s-phone" label="Phone number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} disabled={isLoading} />
            <PinInput value={password} onChange={setPassword} disabled={isLoading} />
            <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase">
              {isLoading ? "Please wait…" : "Create Account"}
            </Button>
            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")} className="text-yellow-400 hover:underline font-medium">Log in</button>
            </p>
          </form>
        )}

        {/* Login form */}
        {!isAdmin && mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            <FloatingLabelInput id="l-phone" label="Phone number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} disabled={isLoading} />
            <PinInput value={password} onChange={setPassword} disabled={isLoading} />
            <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase">
              {isLoading ? "Please wait…" : "Login"}
            </Button>
            <p className="text-center text-sm text-white/50">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => switchMode("signup")} className="text-yellow-400 hover:underline font-medium">Sign up</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function useHeroScroll() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const offset = Math.min(window.scrollY, window.innerHeight * 0.05);
      hero.style.transform = `translateY(-${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return heroRef;
}

export default function LandingPage() {
  const heroRef = useHeroScroll();
  return (
    <div className="w-full bg-black/80 text-foreground">

      {/* STAGE 1: FIXED HERO SECTION */}
      <section ref={heroRef} id="photographer-auth" className="fixed z-0 top-0 left-0 w-full h-[105vh] flex flex-col xl:flex-row xl:items-start border-b bg-black/90 border-border pt-[9vh]">
        <div id="hero" className="flex-1 flex flex-col justify-center xl:p-0">
          <h1 className="lg:text-[13rem] sm:text-[11rem] text-[8rem] font-bold leading-[0.85]">GOLDEN</h1>
          <h1 className="lg:text-[12rem] sm:text-[10rem] text-[7.5rem] font-bold leading-[0.85]">FOCUS</h1>
          <div className="relative flex">
            <h1 className="lg:text-[10rem] w-fit sm:text-[10rem] text-[7rem] font-bold leading-[0.85]">AI</h1>
            <p className="text-white/60 text-[1.1rem] max-w-[15vw]">AI-powered face recognition for photographers. Upload photos, clients find themselves instantly.</p>
          </div>
        </div>
        <Rotate  />
        <Suspense fallback={<div className="w-full xl:w-[min(30%,32rem)] h-32 animate-pulse rounded-2xl bg-white/10" />}>
          <HeroPanel />
        </Suspense>
      </section>

      {/* CONTENT CONTAINER */}
      <div className="mt-[105vh] z-11 relative">
        {/* STAGE 2: Features Section */}
        <section className="w-full h-[120vh] sticky -top-20 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-red-200">
          <p className="text-xs font-pixel text-yellow-400 mb-[2vh] tracking-widest uppercase">AI-Powered Photography Platform</p>
          <h2 className="font-pixel text-[3vw] sm:text-[5vw] text-white mb-[3vh] leading-tight max-w-[90vw] text-center">
            Let Your Clients Find <span className="text-yellow-400">Themselves</span> in Every Shot
          </h2>
          <p className="text-white/60 text-[2vw] max-w-[80vw] mb-[4vh] text-center">
            GoldenFocus AI uses face recognition to instantly match event photos to the right people.
          </p>
          <div className="flex flex-col sm:flex-row gap-[2vw]">
            <a href="/#signup" className="px-[2vw] py-[1.5vh] bg-yellow-400 text-black font-pixel text-[1.2vw] hover:bg-yellow-300 transition-colors text-center whitespace-nowrap">Join as Photographer</a>
            <a href="/#login" className="px-[2vw] py-[1.5vh] border border-yellow-400/40 text-white text-[1.2vw] hover:border-yellow-400 hover:text-yellow-400 transition-colors text-center whitespace-nowrap">Login to Dashboard</a>
          </div>
        </section>

        {/* STAGE 3: What We Do */}
        <section className="w-full mt-15vh h-[120vh] sticky -top-20 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-black/80">
          <h2 className="font-pixel text-[2.5vw] text-yellow-400 mb-[6vh] text-center">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[3vw] w-full max-w-[90vw]">
            {features.map((item) => (
              <div key={item.title} className="border border-white/10 bg-white/5 backdrop-blur p-[2vw] flex flex-col gap-[1.5vh] rounded-xl h-fit">
                <span className="text-[3vw]">{item.icon}</span>
                <h3 className="font-pixel text-[1.3vw] text-white">{item.title}</h3>
                <p className="text-white/50 text-[1vw]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STAGE 4: Why GoldenFocus AI */}
        <section className="w-full h-[140vh] mt-15vh sticky -top-40 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-black/80">
          <h2 className="font-pixel text-[2.5vw] text-yellow-400 mb-[6vh] text-center">Why GoldenFocus AI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2vw] w-full max-w-[90vw]">
            {benefits.map((item) => (
              <div key={item.title} className="flex gap-[1vw] p-[2vw] border border-white/10 bg-white/5 backdrop-blur rounded-xl">
                <span className="text-yellow-400 font-pixel text-[1.5vw] mt-[0.5vh] shrink-0">▸</span>
                <div>
                  <h3 className="font-pixel text-[1.3vw] text-white mb-[0.5vh]">{item.title}</h3>
                  <p className="text-white/50 text-[1vw]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STAGE 5: How It Works + Footer */}
        <section className="w-full h-[180vh] mt-15vh flex flex-col sticky top-0 px-[4vw] py-[4vh] border-b border-border bg-green-900">
          <h2 className="font-pixel text-[2.5vw] text-yellow-400 mb-[6vh] text-center">How It Works</h2>
          <div className="flex-1 flex flex-col sm:flex-row gap-[1vw] mb-[8vh]">
            {steps.map((item, i) => (
              <div key={item.step} className="flex-1 flex flex-col items-center justify-center text-center p-[2vw] border border-white/10 bg-white/5 backdrop-blur rounded-xl relative min-h-[20vh]">
                <span className="font-pixel text-yellow-400 text-[2.5vw] mb-[1.5vh]">{item.step}</span>
                <p className="text-[1vw] text-white/60">{item.label}</p>
                {i < steps.length - 1 && (
                  <span className="hidden sm:block absolute -right-[1.5vw] top-1/2 -translate-y-1/2 text-yellow-400 z-10 font-pixel text-[1.5vw]">▸</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center text-center py-[4vh] mb-[4vh]">
            <h2 className="font-pixel text-[2vw] text-white mb-[2vh]">Ready to Transform Your Photography Business?</h2>
            <p className="text-white/60 mb-[3vh] max-w-[70vw] text-[1.2vw]">Join photographers already using GoldenFocus AI to deliver a faster, smarter client experience.</p>
            <a href="/#signup" className="px-[2.5vw] py-[1.5vh] bg-yellow-400 text-black font-pixel text-[1.2vw] hover:bg-yellow-300 transition-colors">Get Started Free</a>
          </div>
          <footer className="px-[2vw] py-[2vh] flex flex-col sm:flex-row items-center justify-between gap-[1.5vw] text-white/40 text-[0.9vw] border-t border-white/10 mt-auto">
            <span className="font-pixel text-yellow-400">GoldenFocus AI</span>
            <div className="flex flex-wrap gap-[1.5vw] sm:gap-[2vw] justify-center">
              <a href="/#login" className="hover:text-yellow-400 transition-colors">Photographer Login</a>
              <a href="/#signup" className="hover:text-yellow-400 transition-colors">Sign Up</a>
              <Link href="/?admin=1#login" className="hover:text-yellow-400 transition-colors">Admin Login</Link>
            </div>
            <span>© 2025 GoldenFocus AI</span>
          </footer>
        </section>
      </div>
    </div>
  );
}
