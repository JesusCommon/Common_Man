import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Admin from "@/pages/Admin";
import AdminBuscar from "@/pages/AdminBuscar";
import AdminRecargar from "@/pages/AdminRecargar";

export const adminRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin", element: <Admin /> },
      { path: "/admin/buscar", element: <AdminBuscar /> },
      { path: "/admin/recargas", element: <AdminRecargar /> },
    ],
  },
];