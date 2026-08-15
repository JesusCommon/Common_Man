import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { useAuthInit } from "@/hooks";
import Home from "./pages/home";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Password from "./pages/Password";
import Buscar from "./pages/Buscar";
import RecargarSaldo from "./pages/RecargarSaldo";
import Admin from "./pages/Admin";

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

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Usuario normal */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/password" element={<Password />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/recargar" element={<RecargarSaldo />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}