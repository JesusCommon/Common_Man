import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { useAuthInit } from "@/hooks";
import AppRoutes from "@/routes";

function AppContent() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  useAuthInit();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!useAuthStore.getState().hasHydrated) {
        useAuthStore.getState().setHasHydrated(true);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <AppRoutes />;
}

export default function App() {
  return <AppContent />;
}