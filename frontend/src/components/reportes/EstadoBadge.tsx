interface EstadoBadgeProps {
  estado: string;
}

const ESTADO_CONFIG: Record<string, { label: string; className: string }> = {
  abierto: {
    label: "Abierto",
    className: "bg-blue-100 text-blue-800",
  },
  en_progreso: {
    label: "En progreso",
    className: "bg-yellow-100 text-yellow-800",
  },
  resuelto: {
    label: "Resuelto",
    className: "bg-green-100 text-green-800",
  },
  cerrado: {
    label: "Cerrado",
    className: "bg-gray-100 text-gray-800",
  },
};

const CATEGORIA_CONFIG: Record<string, { label: string; className: string }> = {
  compra: { label: "Compra", className: "bg-purple-100 text-purple-800" },
  producto: { label: "Producto", className: "bg-orange-100 text-orange-800" },
  pago: { label: "Pago", className: "bg-emerald-100 text-emerald-800" },
  envio: { label: "Envío", className: "bg-cyan-100 text-cyan-800" },
  cuenta: { label: "Cuenta", className: "bg-rose-100 text-rose-800" },
  otro: { label: "Otro", className: "bg-gray-100 text-gray-700" },
};

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function CategoriaBadge({ categoria }: { categoria: string }) {
  const config = CATEGORIA_CONFIG[categoria] ?? {
    label: categoria,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}