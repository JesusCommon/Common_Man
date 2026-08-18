import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AlertVariant = "error" | "warning" | "success";

interface AlertProps {
  message: string;
  variant?: AlertVariant;
  description?: string;
}

interface VariantStyles {
  container: string;
  icon: string;
  text: string;
  iconComponent: LucideIcon;
}

const styles: Record<AlertVariant, VariantStyles> = {
  error: {
    container: "bg-red-500/5 border-red-500/20",
    icon: "text-red-400",
    text: "text-red-300",
    iconComponent: AlertCircle,
  },
  warning: {
    container: "bg-amber-500/10 border-amber-500/20",
    icon: "text-amber-400",
    text: "text-amber-300",
    iconComponent: AlertCircle,
  },
  success: {
    container: "bg-emerald-500/5 border-emerald-500/20",
    icon: "text-emerald-400",
    text: "text-emerald-400",
    iconComponent: CheckCircle2,
  },
};

export function Alert({ message, variant = "error", description }: AlertProps) {
  const s = styles[variant];
  const Icon = s.iconComponent;

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-5 ${s.container}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${s.icon}`} />
      <div>
        <p className={`text-sm font-medium ${s.text}`}>{message}</p>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}