interface AvatarProps {
  name: string;
  size?: "sm" | "lg";
  variant?: "default" | "primary";
}

export function Avatar({ name, size = "sm", variant = "default" }: AvatarProps) {
  const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : "w-8 h-8 text-xs";
  const variantClass =
    variant === "primary"
      ? "bg-gradient-to-br from-blue-500 to-purple-600"
      : "bg-gradient-to-br from-slate-600 to-slate-700";

  return (
    <div
      className={`${sizeClass} ${variantClass} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}