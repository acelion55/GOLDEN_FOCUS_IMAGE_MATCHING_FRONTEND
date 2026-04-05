"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/#photographer-auth");
        return;
      }
      if (user.role === "admin") { router.push("/admin"); return; }
      if (user.status !== "approved") { router.push("/pending"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (!user || user.role !== "photographer" || user.status !== "approved") return null;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/upload", label: "Upload" },
    { href: "/dashboard/photos", label: "Photos" },
    { href: "/dashboard/events", label: "Events" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-pixel text-xl text-primary">GoldenFocus AI</Link>
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`text-sm transition-colors ${pathname === l.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-border px-4 py-2 flex gap-3 overflow-x-auto">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-sm whitespace-nowrap transition-colors ${pathname === l.href ? "text-foreground" : "text-muted-foreground"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
