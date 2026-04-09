"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

const navLinks = [
  { href: "/photographer", label: "Photographer" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/community", label: "Community" },
  { href: "/faq", label: "FAQ" },
];

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isContact = pathname === "/contact";

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/find") ||
    pathname.startsWith("/pending");

  useEffect(() => {
    if (isDashboard || !navRef.current) return;
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
    );
  }, [isDashboard]);

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    if (menuOpen) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [menuOpen]);

  if (isDashboard) return null;

  function goToHash(hash: "login" | "signup") {
    if (pathname === "/") {
      window.history.replaceState(null, "", `/#${hash}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      router.push(`/#${hash}`);
    }
    setMenuOpen(false);
  }

  return (
    <nav
      ref={navRef}
      className={`fixed pt-[2vh] left-0 w-full z-50 transition-all duration-300 ${
        isContact
          ? "bg-yellow-400 border-yellow-500/40"
          : " border-white/10"
      }`}
     
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className={`font-pixel text-lg shrink-0 transition-colors ${
            isContact ? "text-black hover:text-black/70" : "text-yellow-400 hover:text-yellow-300"
          }`}>
          GoldenFocus AI
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors font-medium ${
                isContact
                  ? pathname === l.href ? "text-black font-bold" : "text-black/60 hover:text-black"
                  : pathname === l.href ? "text-yellow-400" : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => goToHash("login")}
            className={`text-sm transition-colors ${
              isContact ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => goToHash("signup")}
            className={`px-4 py-2 font-pixel text-xs transition-colors ${
              isContact
                ? "bg-black text-yellow-400 hover:bg-black/80"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden backdrop-blur-xl border-b ${
          isContact ? "bg-yellow-400 border-yellow-500/40" : "bg-black/95 border-white/10"
        }`}
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isContact
                  ? pathname === l.href ? "text-black font-bold" : "text-black/60 hover:text-black"
                  : pathname === l.href ? "text-yellow-400" : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className={`flex gap-3 pt-2 border-t ${
            isContact ? "border-black/10" : "border-white/10"
          }`}>
            <button
              onClick={() => goToHash("login")}
              className={`flex-1 text-center py-2 text-sm border transition-colors ${
                isContact
                  ? "text-black/60 border-black/20 hover:border-black/40"
                  : "text-white/60 border-white/20 hover:border-white/40"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => goToHash("signup")}
              className={`flex-1 text-center py-2 font-pixel text-xs transition-colors ${
                isContact
                  ? "bg-black text-yellow-400 hover:bg-black/80"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
