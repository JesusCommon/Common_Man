import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Admin from "@/pages/admin/usuarios/Admin";
import AdminBuscar from "@/pages/admin/usuarios/AdminBuscar";
import AdminBuscarPorNombre from "@/pages/admin/usuarios/AdminBuscarNombre";
import AdminRecargar from "@/pages/admin/usuarios/AdminRecargar";
import CategoriasProductos from "@/pages/admin/categoriasProductos/AdminCategoriasProductos";
import AdminProductos from "@/pages/admin/productos/AdminProductos";
import AdminProductoForm from "@/pages/admin/productos/AdminProductoForm";

export const adminRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/usuarios", element: <Admin /> },
      { path: "/admin/buscar", element: <AdminBuscar /> },
      { path: "/admin/recargas", element: <AdminRecargar /> },
      { path: "/admin/buscar/usuarios", element: <AdminBuscarPorNombre /> },
      { path: "/admin/categoriasProductos", element: <CategoriasProductos /> },
      { path: "/admin/productos", element: <AdminProductos /> },
      { path: "/admin/productos/nuevo", element: <AdminProductoForm /> },
      { path: "/admin/productos/editar/:id", element: <AdminProductoForm /> },
    ],
  },
];