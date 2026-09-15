import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import StoreLayout from "@/components/layout/StoreLayout";
import Dashboard from "@/pages/usuario/Dashboard";
import Configuracion from "@/pages/usuario/Configuracion";
import Buscar from "@/pages/usuario/Buscar";
import RecargarSaldo from "@/pages/usuario/RecargarSaldo";
import PerfilPublico from "@/pages/PerfilPublico";
import CheckoutPage from "@/pages/tienda/CheckoutPage";
import MisCompras from "@/pages/tienda/MisCompras";
import CompraDetalle from "@/pages/tienda/CompraDetalle";
import MisDirecciones from "@/pages/usuario/MisDirecciones";
import MisEnvios from "@/pages/usuario/MisEnvios";
import Notificaciones from '@/pages/usuario/Notificaciones';
import MisReportes from "@/pages/usuario/MisReportes";
import ReporteDetallePage from "@/pages/usuario/ReporteDetalle";

export const userRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      
      { path: "/configuracion", element: <Configuracion /> },
      { path: "/perfil", element: <Navigate to="/configuracion?tab=perfil" replace /> },
      { path: "/password", element: <Navigate to="/configuracion?tab=seguridad" replace /> },
      
      { path: "/buscar", element: <Buscar /> },
      { path: "/recargar", element: <RecargarSaldo /> },
      { path: "/perfil/:username", element: <PerfilPublico /> },
      { path: "/direcciones", element: <MisDirecciones /> },
      { path: "/envios", element: <MisEnvios /> },
      { path: '/notificaciones', element: <Notificaciones /> },
      { path: "soporte", element: <MisReportes /> },
      { path: "soporte/:reporteId", element: <ReporteDetallePage /> },
    ],
  },
  
  {
    element: (
      <ProtectedRoute>
        <StoreLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/tienda/checkout", element: <CheckoutPage /> },
      { path: "/tienda/mis-compras", element: <MisCompras /> },
      { path: "/tienda/mis-compras/:orden", element: <CompraDetalle /> },
    ],
  },
];