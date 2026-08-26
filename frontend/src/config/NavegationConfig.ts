import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  Plus, 
  Settings 
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
    route: "/admin/dashboard",
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
    id: "catalogo",
    label: "Catálogo",
    icon: Folder,
    children: [
      { label: "Categorías", route: "/admin/categoriasProductos" },
      { 
        label: "Productos", 
        route: "/admin/productos",
        toolbarActions: [
          { 
            label: "Nuevo Producto", 
            icon: Plus, 
            onClick: () => window.location.href = "/admin/productos/nuevo", 
            variant: "primary" 
          }
        ]
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    children: [
      { label: "General", route: "/admin/configuracion" },
    ],
  },
];