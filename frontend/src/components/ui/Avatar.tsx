interface AvatarProps {
  name: string;
  size?: "sm" | "lg";
  variant?: "default" | "primary";
}

export function Avatar({ name, size = "sm", variant = "default" }: AvatarProps) {
  const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : "w-8 h-8 text-xs";
  const variantClass =
    variant === "primary"
      ? "bg-blue-600 text-white"
      : "bg-slate-100 text-slate-700 border border-slate-200";

  return (
    <div
      className={`${sizeClass} ${variantClass} rounded-full flex items-center justify-center font-bold shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}