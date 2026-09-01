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
    container: "bg-red-50 border-red-200",
    icon: "text-red-500",
    text: "text-red-700",
    iconComponent: AlertCircle,
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    icon: "text-amber-500",
    text: "text-amber-700",
    iconComponent: AlertCircle,
  },
  success: {
    container: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-500",
    text: "text-emerald-700",
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
        {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
      </div>
    </div>
  );
}