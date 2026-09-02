import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Admin from "@/pages/admin/usuarios/Admin";
import AdminBuscar from "@/pages/admin/usuarios/AdminBuscar";
import AdminBuscarPorNombre from "@/pages/admin/usuarios/AdminBuscarNombre";
import AdminRecargar from "@/pages/admin/usuarios/AdminRecargar";
import AdminCategoriasProductos from "@/pages/admin/categoriasProductos/AdminCategoriasProductos";
import AdminCategoriaForm from "@/pages/admin/categoriasProductos/AdminCategoriaForm";
import AdminBuscarCategoria from "@/pages/admin/categoriasProductos/AdminBuscarCategoria";
import AdminProductos from "@/pages/admin/productos/AdminProductos";
import AdminProductoForm from "@/pages/admin/productos/AdminProductoForm";
import AdminBuscarProducto from "@/pages/admin/productos/AdminBuscarProductos";
import AdminFinanzas from "@/pages/admin/AdminFinanzas";

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
      
      // Usuarios
      { path: "/admin/usuarios", element: <Admin /> },
      { path: "/admin/buscar", element: <AdminBuscar /> },
      { path: "/admin/recargas", element: <AdminRecargar /> },
      { path: "/admin/buscar/usuarios", element: <AdminBuscarPorNombre /> },
      
      // Categorías
      { path: "/admin/categoriasProductos", element: <AdminCategoriasProductos /> },
      { path: "/admin/categoriasProductos/nueva", element: <AdminCategoriaForm /> },
      { path: "/admin/categoriasProductos/editar/:id", element: <AdminCategoriaForm /> },
      { path: "/admin/categoriasProductos/buscar", element: <AdminBuscarCategoria /> },
      
      // Productos
      { path: "/admin/productos", element: <AdminProductos /> },
      { path: "/admin/productos/nuevo", element: <AdminProductoForm /> },
      { path: "/admin/productos/editar/:id", element: <AdminProductoForm /> },
      { path: "/admin/productos/buscar", element: <AdminBuscarProducto /> },
      
      // Finanzas
      { path: "/admin/finanzas", element: <AdminFinanzas /> },
    ],
  },
];