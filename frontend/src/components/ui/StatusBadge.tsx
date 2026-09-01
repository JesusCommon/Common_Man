import { CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  active,
  activeLabel = "Activo",
  inactiveLabel = "Inactivo",
}: StatusBadgeProps) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-medium">
      <CheckCircle2 className="w-3.5 h-3.5" />
      {activeLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full font-medium">
      <XCircle className="w-3.5 h-3.5" />
      {inactiveLabel}
    </span>
  );
}