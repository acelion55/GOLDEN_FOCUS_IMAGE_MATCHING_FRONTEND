"use client";

import { useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-black/80"><div className="text-white/60">Loading...</div></div>;
  }

  if (!user || user.role !== "admin") return null;

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/photographers", label: "Photographers" },
    { href: "/admin/events", label: "Events" },
  ];

  return (
    <div className="min-h-screen bg-black/80">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-pixel text-xl text-yellow-400">GoldenFocus AI</Link>
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`text-sm transition-colors ${pathname === l.href ? "text-yellow-400 font-medium" : "text-white/50 hover:text-white"}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/40 hidden sm:block">{user.name} · Admin</span>
            <Button variant="outline" size="sm" onClick={logout} className="border-white/20 text-white/70 hover:text-white">Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black/80"><div className="text-white/60">Loading...</div></div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
