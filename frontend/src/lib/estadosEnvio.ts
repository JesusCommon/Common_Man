import type { EstadoEnvioEnum } from "@/api/types";

export interface EstadoEnvioConfig {
  value: EstadoEnvioEnum;
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const ESTADOS_ENVIO: EstadoEnvioConfig[] = [
  { value: "pendiente", label: "Pendiente", badgeClass: "bg-amber-50 text-amber-600 border-amber-200", dotClass: "bg-amber-500" },
  { value: "preparando", label: "Preparando", badgeClass: "bg-blue-50 text-blue-600 border-blue-200", dotClass: "bg-blue-500" },
  { value: "enviado", label: "Enviado", badgeClass: "bg-indigo-50 text-indigo-600 border-indigo-200", dotClass: "bg-indigo-500" },
  { value: "en_transito", label: "En tránsito", badgeClass: "bg-violet-50 text-violet-600 border-violet-200", dotClass: "bg-violet-500" },
  { value: "entregado", label: "Entregado", badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200", dotClass: "bg-emerald-500" },
  { value: "cancelado", label: "Cancelado", badgeClass: "bg-red-50 text-red-600 border-red-200", dotClass: "bg-red-500" },
];

export function getEstadoEnvioConfig(estado: EstadoEnvioEnum): EstadoEnvioConfig {
  return ESTADOS_ENVIO.find((e) => e.value === estado) ?? ESTADOS_ENVIO[0];
}

export function formatFecha(iso?: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}