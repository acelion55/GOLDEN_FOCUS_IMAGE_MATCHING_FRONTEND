"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/lib/auth-context";
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

function HomeAuthForm() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "1" || searchParams.get("role") === "admin";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const signupWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const prevModeRef = useRef<"login" | "signup" | null>(null);
  const skipIntroAnim = useRef(true);

  useLayoutEffect(() => {
    if (isAdmin) return;
    const wrap = signupWrapRef.current;
    if (!wrap) return;
    const inner = wrap.querySelector("[data-signup-inner]") as HTMLElement | null;
    if (!inner) return;
    const fields = inner.children;
    const isInitial = prevModeRef.current === null;
    if (isInitial) {
      if (mode === "login") {
        gsap.set(wrap, { height: 0, overflow: "hidden" });
        gsap.set(fields, { opacity: 0, y: -10 });
      } else {
        gsap.set(wrap, { height: "auto", overflow: "visible" });
        gsap.set(fields, { opacity: 1, y: 0 });
      }
      prevModeRef.current = mode;
      return;
    }
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;
    gsap.killTweensOf([wrap, ...Array.from(fields)]);
    if (mode === "signup") {
      gsap.set(wrap, { height: "auto", overflow: "visible" });
      gsap.set(fields, { clearProps: "opacity,transform" });
      void wrap.offsetHeight;
      const targetH = Math.max(inner.scrollHeight, inner.offsetHeight, 120);
      gsap.set(fields, { opacity: 0, y: -14 });
      gsap.set(wrap, { height: 0, overflow: "hidden" });
      gsap.to(wrap, { height: targetH, duration: 0.48, ease: "power2.out", onComplete: () => { gsap.set(wrap, { height: "auto", overflow: "visible" }); } });
      gsap.fromTo(fields, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.065, ease: "power2.out", delay: 0.06 });
    } else {
      gsap.set(wrap, { overflow: "hidden" });
      gsap.set(wrap, { height: wrap.offsetHeight });
      gsap.to(fields, { opacity: 0, y: -14, duration: 0.24, stagger: { each: 0.035, from: "start" }, ease: "power2.in" });
      gsap.to(wrap, { height: 0, duration: 0.4, ease: "power2.inOut", delay: 0.05 });
    }
  }, [mode, isAdmin]);

  useLayoutEffect(() => {
    if (isAdmin) return;
    if (skipIntroAnim.current) { skipIntroAnim.current = false; return; }
    if (titleRef.current) gsap.fromTo(titleRef.current, { opacity: 0.35, y: -6 }, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
    if (footerRef.current) gsap.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.05 });
  }, [mode, isAdmin]);

  useEffect(() => {
    if (isAdmin) { setMode("login"); return; }
    if (searchParams.get("mode") === "signup") { setMode("signup"); return; }
    const h = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    if (h === "signup") setMode("signup");
    else setMode("login");
  }, [isAdmin, searchParams]);

  useEffect(() => {
    if (isAdmin) return;
    const applyHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "signup") setMode("signup");
      else setMode("login");
    };
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [isAdmin]);

  function redirectAfterAuth(role: string) {
    if (role === "admin") router.push("/admin");
    else router.push("/dashboard");
  }

  async function handleLogin(e: React.FormEvent) {
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

  async function runSignup() {
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

  async function handlePhotographerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      if (!phone.trim()) { setError("Please enter your phone number"); return; }
      if (password.length !== 4) { setError("Please enter your 4-digit PIN"); return; }
      setIsLoading(true);
      const result = await login(phone.trim(), password.padEnd(8, "0"));
      if (result.success) redirectAfterAuth(result.user.role);
      else if (result.error?.includes("pending")) setError("Your account is under approval. Please contact 9983745802");
      else setError(result.error || "Login failed");
      setIsLoading(false);
    } else {
      await runSignup();
    }
  }

  return (
    <div className="w-full max-w-md p-6 sm:p-10 self-start bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex flex-col transition-all duration-500">
      <h2 ref={titleRef} className="font-pixel text-lg text-white mb-6">
        {isAdmin ? "Admin Login" : mode === "login" ? "Welcome Back" : "Create Account"}
      </h2>

      {error && (
        <div className="mb-4 px-4 py-3 text-sm flex items-center gap-3 bg-red-500/10 text-red-300 border border-red-500/40 rounded-xl">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {isAdmin ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
          <FloatingLabelInput id="admin-email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          <input type="password" placeholder="4-Digit PIN *" value={password} maxLength={4}
            onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))} required disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-yellow-400 focus:outline-none" />
          <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase">
            {isLoading ? "Please wait…" : "Login"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhotographerSubmit} className="flex flex-col gap-4" noValidate>
          <div ref={signupWrapRef} className="min-h-0">
            <div data-signup-inner className="flex flex-col gap-4">
              <FloatingLabelInput id="home-name" label="Full name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading || mode === "login"} tabIndex={mode === "login" ? -1 : 0} />
              <FloatingLabelInput id="home-business" label="Business name (optional)" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} disabled={isLoading || mode === "login"} tabIndex={mode === "login" ? -1 : 0} />
              <FloatingLabelInput id="home-email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || mode === "login"} tabIndex={mode === "login" ? -1 : 0} />
            </div>
          </div>
          <FloatingLabelInput id="home-phone" label="Phone number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} disabled={isLoading} />
          <PinInput value={password} onChange={setPassword} disabled={isLoading} />
          <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase">
            {isLoading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
          </Button>
        </form>
      )}

      {!isAdmin && (
        <div ref={footerRef} className="mt-6 text-center text-sm text-white/50">
          {mode === "login" ? (
            <>Don&apos;t have an account?{" "}
              <a href="/#signup" className="text-yellow-400 hover:underline font-medium" onClick={(e) => { e.preventDefault(); setError(""); setMode("signup"); window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#signup`); }}>Sign up</a>
            </>
          ) : (
            <>Already have an account?{" "}
              <a href="/#photographer-auth" className="text-yellow-400 hover:underline font-medium" onClick={(e) => { e.preventDefault(); setError(""); setMode("login"); window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#photographer-auth`); }}>Log in</a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black/80 text-foreground flex flex-col">
      <section id="photographer-auth" className="flex flex-col xl:flex-row xl:items-start w-full min-h-[min(100vh,56rem)] border-b border-border">
        <div id="hero" className="flex-1 flex flex-col justify-center p-2">
          <h1 className="lg:text-[13rem] sm:text-[11rem] font-bold leading-[0.85] ">GOLDEN</h1>
          <h1 className="lg:text-[12rem] sm:text-[10rem] font-bold leading-[0.85] ">FOCUS</h1>
          <h1 className="lg:text-[10rem] sm:text-[10rem] font-bold leading-[0.85]">AI</h1>
          <p className="mt-6 text-white/60 text-lg max-w-md">AI-powered face recognition for photographers. Upload photos, clients find themselves instantly.</p>
        </div>
        <div id="login-signup-form" className="w-full  xl:w-[min(30%,32rem)] xl:min-w-[22rem] shrink-0 flex items-center justify-center pt-4 pr-4">
          <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse rounded-2xl bg-white/10" />}>
            <HomeAuthForm />
          </Suspense>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center text-center px-6 py-24 border-b border-border">
        <p className="text-xs font-pixel text-yellow-400 mb-4 tracking-widest uppercase">AI-Powered Photography Platform</p>
        <h2 className="font-pixel text-3xl sm:text-5xl text-white mb-6 leading-tight max-w-3xl">
          Let Your Clients Find <span className="text-yellow-400">Themselves</span> in Every Shot
        </h2>
        <p className="text-white/60 text-base sm:text-lg max-w-xl mb-10">
          GoldenFocus AI uses face recognition to instantly match event photos to the right people.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/#signup" className="px-8 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors text-center">Join as Photographer</a>
          <a href="/#photographer-auth" className="px-8 py-3 border border-yellow-400/40 text-white text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors text-center">Login to Dashboard</a>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-border max-w-5xl mx-auto w-full">
        <h2 className="font-pixel text-xl text-yellow-400 mb-12 text-center">What We Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/5 backdrop-blur p-6 flex flex-col gap-3 rounded-xl">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-pixel text-sm text-white">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-pixel text-xl text-yellow-400 mb-12 text-center">Why GoldenFocus AI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <div key={item.title} className="flex gap-4 p-4 border border-white/10 bg-white/5 backdrop-blur rounded-xl">
                <span className="text-yellow-400 font-pixel text-lg mt-0.5">▸</span>
                <div>
                  <h3 className="font-pixel text-sm text-white mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-border max-w-5xl mx-auto w-full">
        <h2 className="font-pixel text-xl text-yellow-400 mb-12 text-center">How It Works</h2>
        <div className="flex flex-col sm:flex-row">
          {steps.map((item, i) => (
            <div key={item.step} className="flex-1 flex flex-col items-center text-center p-6 border border-white/10 bg-white/5 backdrop-blur relative">
              <span className="font-pixel text-yellow-400 text-2xl mb-3">{item.step}</span>
              <p className="text-sm text-white/60">{item.label}</p>
              {i < steps.length - 1 && (
                <span className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-yellow-400 z-10 font-pixel">▸</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 flex flex-col items-center text-center border-b border-border">
        <h2 className="font-pixel text-2xl text-white mb-4">Ready to Transform Your Photography Business?</h2>
        <p className="text-white/60 mb-8 max-w-md">Join photographers already using GoldenFocus AI to deliver a faster, smarter client experience.</p>
        <a href="/#signup" className="px-10 py-3 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 transition-colors">Get Started Free</a>
      </section>

      <footer className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs border-t border-white/10 mt-auto">
        <span className="font-pixel text-yellow-400">GoldenFocus AI</span>
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <a href="/#photographer-auth" className="hover:text-yellow-400 transition-colors">Photographer Login</a>
          <a href="/#signup" className="hover:text-yellow-400 transition-colors">Sign Up</a>
          <Link href="/?admin=1#photographer-auth" className="hover:text-yellow-400 transition-colors">Admin Login</Link>
        </div>
        <span>© 2025 GoldenFocus AI</span>
      </footer>
    </div>
  );
}
