import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface InfoItemProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  valueClassName?: string;
}

export function InfoItem({ label, value, icon: Icon, valueClassName = "text-slate-900 font-medium" }: InfoItemProps) {
  return (
    <div className="rounded-lg bg-white border border-slate-200 p-3 shadow-sm">
      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </p>
      <p className={`text-sm ${valueClassName}`}>{value}</p>
    </div>
  );
}