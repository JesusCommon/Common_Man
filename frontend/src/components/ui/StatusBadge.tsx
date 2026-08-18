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
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
      <CheckCircle2 className="w-3.5 h-3.5" />
      {activeLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
      <XCircle className="w-3.5 h-3.5" />
      {inactiveLabel}
    </span>
  );
}