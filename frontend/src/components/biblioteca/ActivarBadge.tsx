interface ActivoBadgeProps {
  activo: boolean;
}

export function ActivoBadge({ activo }: ActivoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        activo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}