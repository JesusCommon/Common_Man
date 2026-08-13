import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const [isReady, setIsReady] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  // ⏳ Esperamos un micro-tick para que Zustand hidrate desde localStorage
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}