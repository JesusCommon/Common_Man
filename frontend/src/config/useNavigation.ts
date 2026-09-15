import {
  LayoutDashboard,
  Search,
  Wallet,
  MapPin,
  Truck,
  LifeBuoy,
  Bell,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";

export interface UserNavItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  route: string;
}

export const userNavigationConfig: UserNavItem[] = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard, route: "/dashboard" },
  { id: "buscar", label: "Buscar", icon: Search, route: "/buscar" },
  { id: "recargar", label: "Recargar", icon: Wallet, route: "/recargar" },
  { id: "direcciones", label: "Mis Direcciones", icon: MapPin, route: "/direcciones" },
  { id: "envios", label: "Mis Envíos", icon: Truck, route: "/envios" },
  { id: "soporte", label: "Soporte", icon: LifeBuoy, route: "/soporte" },
  { id: "notificaciones", label: "Notificaciones", icon: Bell, route: "/notificaciones" },
  { id: "configuracion", label: "Configuración", icon: Settings, route: "/configuracion" },
];