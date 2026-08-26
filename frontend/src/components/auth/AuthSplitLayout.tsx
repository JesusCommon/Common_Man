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
      // CAMBIO: Tarjetas claras con borde sutil y efecto hover de elevación
      className="p-4 rounded-xl bg-[#FFFFFF]/80 border border-[#E4E4E1] backdrop-blur-sm text-left transition-all hover:bg-[#FFFFFF] hover:border-[#D4D4CE] hover:shadow-sm"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${iconClassName}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-semibold text-[#18181B] mb-0.5">{title}</h3>
      <p className="text-xs text-[#52525B] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function AuthSplitLayout({ children, isRegister = false }: AuthSplitLayoutProps) {
  return (
    // CAMBIO: h-dvh para consistencia con el Home y evitar scroll en móviles
    <div className={`h-dvh w-full flex overflow-hidden bg-[#FAFAF8] ${isRegister ? "lg:flex-row-reverse" : ""}`}>
      
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
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#A1A19A] hover:text-[#2563EB] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Volver al inicio
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2.5">
            {/* CAMBIO: Logo consistente con el Header del Home (negro con letra blanca) */}
            <div className="w-8 h-8 rounded-lg bg-[#18181B] flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-[#FAFAF8]" />
            </div>
            <span className="text-lg font-bold text-[#18181B] tracking-tight font-[Space_Grotesk]">Common Man</span>
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
        // CAMBIO: Fondo claro con gradiente sutil y borde de separación
        className="hidden lg:flex w-1/2 relative bg-[#F4F4F5] overflow-hidden border-l border-[#E4E4E1]"
      >
        {/* Grid de fondo (ahora en tono negro muy suave) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24, 24, 27, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24, 24, 27, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />

        {/* Glow central (ahora en azul muy suave y elegante) */}
        <motion.div
          className="absolute w-125 h-125 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
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

        {/* Partículas (ahora en tono gris medio) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#A1A19A]/40 rounded-full"
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
              // CAMBIO: Icono principal con fondo azul pastel suave
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#EFF4FE] border border-[#BFDBFE] shadow-sm"
            >
              <Shield className="w-7 h-7 text-[#2563EB]" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#18181B] tracking-tight leading-tight">
                Gestiona todo desde <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#1D4ED8]">
                  un solo lugar
                </span>
              </h2>
              <p className="text-sm text-[#52525B] leading-relaxed">
                Únete a Common Man y descubre una nueva forma de organizar y hacer crecer tus proyectos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <FeatureCard
                icon={Lock}
                iconClassName="bg-amber-50 text-amber-600 border border-amber-100"
                title="Protegido"
                description="Contraseñas hasheadas con bcrypt."
                delay={0}
              />
              <FeatureCard
                icon={Zap}
                iconClassName="bg-blue-50 text-blue-600 border border-blue-100"
                title="Rápido"
                description="Interfaz optimizada para tu flujo."
                delay={0.1}
              />
              <FeatureCard
                icon={CheckCircle2}
                iconClassName="bg-emerald-50 text-emerald-600 border border-emerald-100"
                title="Confiable"
                description="Validación y manejo de errores."
                delay={0.2}
              />
              <FeatureCard
                icon={Shield}
                iconClassName="bg-indigo-50 text-indigo-600 border border-indigo-100"
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