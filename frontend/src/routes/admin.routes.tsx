import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Admin from "@/pages/admin/usuarios/Admin";
import AdminRecargar from "@/pages/admin/usuarios/AdminRecargar";
import AdminCategoriasProductos from "@/pages/admin/categoriasProductos/AdminCategoriasProductos";
import AdminCategoriaForm from "@/pages/admin/categoriasProductos/AdminCategoriaForm";
import AdminBuscarCategoria from "@/pages/admin/categoriasProductos/AdminBuscarCategoria";
import AdminProductos from "@/pages/admin/productos/AdminProductos";
import AdminProductoForm from "@/pages/admin/productos/AdminProductoForm";
import AdminBuscarProducto from "@/pages/admin/productos/AdminBuscarProductos";
import AdminFinanzas from "@/pages/admin/AdminFinanzas";
import AdminEnvios from "@/pages/admin/envios/EnviosAdmin";
import AdminReportes from "@/pages/admin/reportes/AdminReportes";
import AdminReporteDetalle from "@/pages/admin/reportes/AdminReporteDetalle";
import AdminAutores from "@/pages/admin/biblioteca/AdminAutores";
import AdminEditoriales from "@/pages/admin/biblioteca/AdminEditoriales";
import AdminGeneros from "@/pages/admin/biblioteca/AdminGeneros";
import AdminLibros from "@/pages/admin/biblioteca/AdminLibros";


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
      { path: "/admin/recargas", element: <AdminRecargar /> },
      
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

      // Envios
      { path: "/admin/envios", element: <AdminEnvios /> },

      // Reportes
      { path: "/admin/soporte", element: <AdminReportes /> },
      { path: "/admin/soporte/:reporteId", element: <AdminReporteDetalle /> },

      { path: "/admin/biblioteca/autores", element: <AdminAutores /> },
      { path: "/admin/biblioteca/editoriales", element: <AdminEditoriales /> },
      { path: "/admin/biblioteca/generos", element: <AdminGeneros /> },
      { path: "/admin/biblioteca/libros", element: <AdminLibros /> },
    ],
  },
];