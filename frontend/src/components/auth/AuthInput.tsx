import type { InputHTMLAttributes, Ref } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  optional?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function AuthInput({
  label,
  icon: Icon,
  error,
  hint,
  optional = false,
  className,
  ref,
  ...inputProps
}: AuthInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-300">
        {label} {optional && <span className="text-slate-600 font-normal">(opcional)</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          ref={ref}
          {...inputProps}
          className={cn(
            "w-full pl-9 pr-3 rounded-lg bg-slate-900/50 border text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all text-sm h-9",
            error
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
              : "border-slate-800 focus:ring-blue-500/30 focus:border-blue-500/50",
            className
          )}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-400 leading-tight">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-600 leading-tight">{hint}</p>
      ) : null}
    </div>
  );
}