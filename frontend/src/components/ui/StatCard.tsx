import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconClassName?: string;
}

export function StatCard({ icon: Icon, label, value, iconClassName = "text-blue-400" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconClassName}`} />
        <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}