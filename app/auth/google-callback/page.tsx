"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/google-token")
      .then((r) => r.json())
      .then((data) => {
        if (data.token && data.user) {
          localStorage.setItem("gf_token", data.token);
          if (data.user.role === "admin") router.replace("/admin");
          else router.replace("/dashboard");
        } else {
          router.replace("/?error=google_auth_failed");
        }
      })
      .catch(() => router.replace("/?error=google_auth_failed"));
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/60 font-pixel text-sm animate-pulse">Signing you in…</p>
    </div>
  );
}
