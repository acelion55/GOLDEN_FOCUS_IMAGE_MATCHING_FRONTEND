"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function PendingApprovalPage() {
  const { user, isLoading, logout, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/#photographer-auth");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else if (user.status === "approved") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  const handleRefresh = async () => {
    await refreshUser();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "photographer") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-pixel text-2xl text-primary mb-4">GoldenFocus AI</h1>

        {user.status === "pending" && (
          <div className="border border-yellow-400/30 bg-yellow-400/5 rounded-2xl p-8 mb-6">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="font-pixel text-lg text-yellow-400 mb-3">Under Review</h2>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Your account is currently under approval. Our team will review your details shortly.
            </p>
            <div className="border border-white/10 bg-black/40 rounded-xl p-4 mb-6">
              <p className="text-white/40 text-xs mb-1">To get approved faster, contact us:</p>
              <a href="tel:9983745802" className="text-yellow-400 font-pixel text-xl hover:text-yellow-300 transition-colors">
                📞 9983745802
              </a>
              <p className="text-white/30 text-xs mt-1">WhatsApp or Call</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleRefresh} className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-pixel text-xs">
                Check Approval Status
              </Button>
              <Button onClick={logout} variant="ghost" className="text-white/40 hover:text-white">
                Logout
              </Button>
            </div>
          </div>
        )}

        {user.status === "suspended" && (
          <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8 mb-6">
            <div className="text-5xl mb-4">🚫</div>
            <h2 className="font-pixel text-lg text-red-400 mb-3">Account Suspended</h2>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Your account has been suspended. Please contact us to resolve this.
            </p>
            <div className="border border-white/10 bg-black/40 rounded-xl p-4 mb-6">
              <p className="text-white/40 text-xs mb-1">Contact us to resolve:</p>
              <a href="tel:9983745802" className="text-yellow-400 font-pixel text-xl hover:text-yellow-300 transition-colors">
                📞 9983745802
              </a>
              <p className="text-white/30 text-xs mt-1">WhatsApp or Call</p>
            </div>
            <Button onClick={logout} variant="outline" className="w-full border-white/20 text-white/60 hover:text-white">
              Logout
            </Button>
          </div>
        )}

        <p className="text-white/30 text-xs">
          Need help?{" "}
          <a href="tel:9983745802" className="text-yellow-400 hover:underline">
            Call 9983745802
          </a>
        </p>
      </div>
    </div>
  );
}
