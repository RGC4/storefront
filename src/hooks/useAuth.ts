// src/hooks/useAuth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hook for client components to access the current session.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
}

export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user ?? null);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    logout,
  };
}
