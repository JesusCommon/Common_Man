import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Perfil from "@/pages/Perfil";
import Password from "@/pages/Password";
import Buscar from "@/pages/Buscar";
import RecargarSaldo from "@/pages/RecargarSaldo";
import PerfilPublico from "@/pages/PerfilPublico";

export const userRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/perfil", element: <Perfil /> },
      { path: "/password", element: <Password /> },
      { path: "/buscar", element: <Buscar /> },
      { path: "/recargar", element: <RecargarSaldo /> },
      { path: "/perfil/:username", element: <PerfilPublico/>}
    ],
  },
];