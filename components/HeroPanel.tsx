"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

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
          className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-yellow-400 focus:outline-none focus:bg-white/20 transition-all caret-transparent relative z-[10000]"
        />
      ))}
    </div>
  );
}

type PanelMode = "idle" | "signup" | "login";

export default function HeroPanel() {
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
    <div className={`
      w-full md:w-[45%] lg:w-[35%] xl:w-[min(30%,32rem)] xl:min-w-[22rem] shrink-0 
      md:flex md:items-center md:justify-center md:pr-4 md:pt-4 md:pb-0 
      absolute md:relative left-0 px-4 md:px-0 transition-all duration-500 z-[9999]
      ${mode === 'idle' ? 'top-[65%] md:top-0' : 'top-[25%] md:top-0'}`}>

      <div ref={ctaRef} className="flex flex-col items-start gap-3 w-full max-w-md relative z-[9999]">
        <p className="text-white/50 text-sm">Ready to grow your photography business?</p>
        <button
          onClick={() => switchMode("signup")}
          className="px-8 py-4 bg-yellow-400 text-black font-pixel text-sm hover:bg-yellow-300 active:scale-95 transition-all relative z-[9999]"
        >
          Join as Photographer →
        </button>
      </div>

      <div ref={formRef} style={{ display: "none" }} className="flex-col w-full max-w-md gap-1 relative z-[9999] bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-pixel text-lg text-white">
            {isAdmin ? "Admin Login" : mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          {!isAdmin && (
            <button
              onClick={() => switchMode("idle")}
              className="text-white/30 hover:text-white/70 text-xl transition-colors leading-none relative z-[10000] p-2 -m-2"
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

        {isAdmin && (
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 relative z-[10000]" noValidate>
            <div className="relative z-[10000]">
              <FloatingLabelInput 
                id="admin-email" 
                label="Email" 
                type="email" 
                autoComplete="username" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoading} 
              />
            </div>
            <input 
              type="password" 
              placeholder="4-Digit PIN *" 
              value={password} 
              maxLength={4}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))} 
              required 
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-yellow-400 focus:outline-none relative z-[10000]" 
            />
            <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase relative z-[10000]">
              {isLoading ? "Please wait…" : "Login"}
            </Button>
          </form>
        )}

        {!isAdmin && mode === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4 relative z-[10000]" noValidate>
            <div className="relative z-[10000]">
              <FloatingLabelInput 
                id="s-name" 
                label="Full name" 
                type="text" 
                autoComplete="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={isLoading} 
              />
            </div>
            <div className="relative z-[10000]">
              <FloatingLabelInput 
                id="s-business" 
                label="Business name (optional)" 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                disabled={isLoading} 
              />
            </div>
            <div className="relative z-[10000]">
              <FloatingLabelInput 
                id="s-email" 
                label="Email" 
                type="email" 
                autoComplete="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading} 
              />
            </div>
            <div className="relative z-[10000]">
              <FloatingLabelInput 
                id="s-phone" 
                label="Phone number" 
                type="tel" 
                inputMode="numeric" 
                maxLength={10} 
                autoComplete="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                disabled={isLoading} 
              />
            </div>
            <div className="relative z-[10000]">
              <PinInput value={password} onChange={setPassword} disabled={isLoading} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase relative z-[10000]">
              {isLoading ? "Please wait…" : "Create Account"}
            </Button>
            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")} className="text-yellow-400 hover:underline font-medium relative z-[10000]">Log in</button>
            </p>
          </form>
        )}

        {!isAdmin && mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-[10000]" noValidate>
            <div className="relative z-[10000]">
              <FloatingLabelInput 
                id="l-phone" 
                label="Phone number" 
                type="tel" 
                inputMode="numeric" 
                maxLength={10} 
                autoComplete="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                disabled={isLoading} 
              />
            </div>
            <div className="relative z-[10000]">
              <PinInput value={password} onChange={setPassword} disabled={isLoading} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full mt-1 font-pixel text-xs uppercase relative z-[10000]">
              {isLoading ? "Please wait…" : "Login"}
            </Button>
            <p className="text-center text-sm text-white/50">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => switchMode("signup")} className="text-yellow-400 hover:underline font-medium relative z-[10000]">Sign up</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}