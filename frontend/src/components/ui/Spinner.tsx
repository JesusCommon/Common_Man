interface SpinnerProps {
  size?: "sm" | "md";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const spinnerClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const heightClass = size === "sm" ? "h-32" : "h-64";

  return (
    <div className={`flex items-center justify-center ${heightClass}`}>
      <div
        className={`${spinnerClass} border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
}