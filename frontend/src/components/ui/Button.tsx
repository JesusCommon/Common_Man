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
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          
          variant === "primary" && [
            "bg-white text-slate-950",
            "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.1)]",
            "hover:shadow-[0_8px_24px_rgba(248,250,252,0.15),0_0_0_1px_rgba(255,255,255,0.2)]",
            "hover:-translate-y-0.5 active:translate-y-0",
          ],
          
          variant === "outline" && [
            "border border-slate-700/50 bg-transparent text-slate-200",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
            "hover:bg-slate-800/50 hover:border-slate-600",
            "hover:-translate-y-0.5 active:translate-y-0",
          ],
          
          variant === "ghost" && [
            "bg-transparent text-slate-400",
            "hover:bg-slate-800/50 hover:text-slate-200",
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