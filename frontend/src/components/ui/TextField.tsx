import type { LucideIcon } from "lucide-react";

type FocusColor = "blue" | "emerald";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  placeholder?: string;
  type?: "text" | "number";
  hint?: string;
  mono?: boolean;
  min?: number;
  focusColor?: FocusColor;
}

const focusStyles: Record<FocusColor, string> = {
  blue: "focus:ring-blue-500/30 focus:border-blue-500/50",
  emerald: "focus:ring-emerald-500/30 focus:border-emerald-500/50",
};

export function TextField({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = "text",
  hint,
  mono = false,
  min,
  focusColor = "blue",
}: TextFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full h-11 px-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 text-sm ${focusStyles[focusColor]} ${mono ? "font-mono" : ""}`}
      />
      {hint && <p className="mt-1.5 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}