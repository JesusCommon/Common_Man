import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  Package, 
  Wallet, 
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
      { label: "Buscar por ID/UUID", route: "/admin/buscar" },
      { label: "Buscar por Nombre", route: "/admin/buscar/usuarios" },
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
];