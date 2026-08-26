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
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#18181B]">
        {label} {optional && <span className="text-[#A1A19A] font-normal">(opcional)</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A19A] pointer-events-none" />
        <input
          ref={ref}
          {...inputProps}
          className={cn(
            "w-full pl-9 pr-3 rounded-lg bg-[#FFFFFF] border text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 transition-all text-sm h-10",
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-[#E4E4E1] focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D4D4CE]",
            className
          )}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600 leading-tight">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#A1A19A] leading-tight">{hint}</p>
      ) : null}
    </div>
  );
}