import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center px-4 overflow-hidden">
      {/* Grid de fondo (mismo patrón que Home) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      
      {/* Glow sutil */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}