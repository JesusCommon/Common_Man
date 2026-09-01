import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  icon?: LucideIcon;
  onChange?: (value: string) => void;
}

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ label, error, multiline, rows = 3, required, icon: Icon, className, onChange, value, ...props }, ref) => {
    const baseClasses = cn(
      "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400",
      "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      error ? "border-red-300 focus:border-red-500 focus:ring-red-500/30" : "border-gray-300",
      Icon && !multiline ? "pl-10" : "",
      className
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && !multiline && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              value={value}
              onChange={handleChange}
              className={cn(baseClasses, "resize-y")}
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type="text"
              value={value}
              onChange={handleChange}
              className={baseClasses}
              {...props}
            />
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
TextField.displayName = "TextField";