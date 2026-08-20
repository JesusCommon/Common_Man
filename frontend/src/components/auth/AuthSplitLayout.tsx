import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Zap, Lock, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthSplitLayoutProps {
  children: ReactNode;
  isRegister?: boolean;
}

interface FeatureCardProps {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  description: string;
  delay?: number;
}

function FeatureCard({ icon: Icon, iconClassName, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm text-left transition-all hover:bg-slate-800/60 hover:border-slate-600/50"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${iconClassName}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-semibold text-white mb-0.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function AuthSplitLayout({ children, isRegister = false }: AuthSplitLayoutProps) {
  return (
    <div className={`h-screen w-full flex overflow-hidden bg-slate-950 ${isRegister ? "lg:flex-row-reverse" : ""}`}>
      {/* LADO DEL FORMULARIO */}
      <motion.div
        layout
        initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 relative"
      >
        {/* Volver al Home */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Volver al inicio
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Common Man</span>
          </div>
          {children}
        </div>
      </motion.div>

      {/* LADO DE BRANDING */}
      <motion.div
        layout
        initial={{ opacity: 0, x: isRegister ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="hidden lg:flex w-1/2 relative bg-slate-950 overflow-hidden"
      >
        {/* Grid de fondo */}
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

        {/* Glow central */}
        <motion.div
          className="absolute w-125 h-125 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-slate-950 to-indigo-900/20" />
        <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />

        {/* Partículas */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-400/40 rounded-full"
            style={{ left: `${15 + i * 12}%` }}
            animate={{
              y: ["100vh", "-20px"],
              x: [0, 20, -15, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 7 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "linear",
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-10 text-center">
          <div className="max-w-sm space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md shadow-2xl shadow-blue-500/10"
            >
              <Shield className="w-7 h-7 text-blue-400" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                Gestiona todo desde <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                  un solo lugar
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Únete a Common Man y descubre una nueva forma de organizar y hacer crecer tus proyectos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <FeatureCard
                icon={Lock}
                iconClassName="bg-amber-500/10 text-amber-400"
                title="Protegido"
                description="Contraseñas hasheadas con bcrypt."
                delay={0}
              />
              <FeatureCard
                icon={Zap}
                iconClassName="bg-blue-500/10 text-blue-400"
                title="Rápido"
                description="Interfaz optimizada para tu flujo."
                delay={0.1}
              />
              <FeatureCard
                icon={CheckCircle2}
                iconClassName="bg-emerald-500/10 text-emerald-400"
                title="Confiable"
                description="Validación y manejo de errores."
                delay={0.2}
              />
              <FeatureCard
                icon={Shield}
                iconClassName="bg-indigo-500/10 text-indigo-400"
                title="Privado"
                description="Tus datos nunca se comparten."
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}