"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "photographer";
export type UserStatus = "pending" | "approved" | "suspended";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  uniqueLink?: string;
  businessName?: string;
  phone?: string;
  createdAt?: string;
}

type AuthResult = { success: true; user: User } | { success: false; error?: string };

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<AuthResult>;
  signup: (data: SignupData) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  businessName?: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("gf_token") : null;
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem("gf_token");
    if (!stored) { setUser(null); return; }
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(stored);
      } else {
        localStorage.removeItem("gf_token");
        setUser(null);
        setToken(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (identifier: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();

      // 403 means account exists but pending/suspended
      if (res.status === 403) {
        return { success: false, error: data.error || "__pending__" };
      }

      if (!res.ok) return { success: false, error: data.error || "Login failed" };

      localStorage.setItem("gf_token", data.token);
      setToken(data.token);
      const u = data.user as User;
      setUser(u);
      return { success: true, user: u };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signup = async (signupData: SignupData): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Signup failed" };

      if (data.token) {
        localStorage.setItem("gf_token", data.token);
        setToken(data.token);
        const u = data.user as User;
        setUser(u);
        return { success: true, user: u };
      }

      return { success: false, error: "Signup did not return a session" };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("gf_token");
    setUser(null);
    setToken(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
