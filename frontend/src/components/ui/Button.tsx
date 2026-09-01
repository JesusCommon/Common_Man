import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          
          variant === "primary" && [
            "bg-blue-600 text-white",
            "shadow-sm hover:bg-blue-700 hover:shadow-md",
            "hover:-translate-y-0.5 active:translate-y-0",
          ],
          
          variant === "outline" && [
            "border border-slate-300 bg-white text-slate-700",
            "shadow-sm hover:bg-slate-50 hover:border-slate-400",
            "hover:-translate-y-0.5 active:translate-y-0",
          ],
          
          variant === "ghost" && [
            "bg-transparent text-slate-600",
            "hover:bg-slate-100 hover:text-slate-900",
          ],
          
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-sm",
          size === "lg" && "h-14 px-8 text-base",
          
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };