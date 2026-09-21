import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  Package, 
  Wallet,
  Truck,
  Library,
  MessageCircle
} from "lucide-react";
import type { ComponentType } from "react";

export interface ToolbarAction {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "primary" | "ghost" | "outline"; 
}

export interface NavChild {
  label: string;
  route: string;
  toolbarActions?: ToolbarAction[];
}

export interface NavModule {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  route?: string;
  children?: NavChild[];
}

export const navigationConfig: NavModule[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    route: "/admin",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: Users,
    children: [
      { label: "Listado General", route: "/admin/usuarios" },
      { label: "Gestión de Recargas", route: "/admin/recargas" },
    ],
  },
  {
    id: "categorias",
    label: "Categorías",
    icon: Folder,
    children: [
      { label: "Listado de Categorías", route: "/admin/categoriasProductos" },
      { label: "Buscar por ID", route: "/admin/categoriasProductos/buscar" },
      { label: "Nueva Categoría", route: "/admin/categoriasProductos/nueva" },
    ],
  },
  {
    id: "productos",
    label: "Productos",
    icon: Package,
    children: [
      { label: "Listado de Productos", route: "/admin/productos" },
      { label: "Buscar Productos", route: "/admin/productos/buscar" },
      { label: "Nuevo Producto", route: "/admin/productos/nuevo" },
    ],
  },
  {
    id: "finanzas",
    label: "Finanzas",
    icon: Wallet,
    children: [
      { label: "Estado de Finanzas", route: "/admin/finanzas" },
    ],
  },
  {
    id: "envios",
    label: "Envíos",
    icon: Truck,
    children: [
      { label: "Gestión de Envíos", route: "/admin/envios" },
    ],
  },
  {
    id: "biblioteca",
    label: "Biblioteca",
    icon: Library,
    children: [
      { label: "Autores", route: "/admin/biblioteca/autores" },
      { label: "Editoriales", route: "/admin/biblioteca/editoriales" },
      { label: "Géneros", route: "/admin/biblioteca/generos" },
      { label: "Libros", route: "/admin/biblioteca/libros" },
    ],
  },
  {
    id: "reporte",
    label: "Reportes",
    icon: MessageCircle,
    children: [
      { label: "Reportes", route: "admin/soporte"}
    ]
  }
];