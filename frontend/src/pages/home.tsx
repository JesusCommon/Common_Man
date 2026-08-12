import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Shield, ArrowRight, UserPlus } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Grid de fondo sutil */}
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

      {/* Glow central animado */}
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

      {/* Partículas flotantes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-slate-400/40 rounded-full"
          style={{ left: `${10 + i * 10}%` }}
          animate={{
            y: ["100vh", "-20px"],
            x: [0, 30, -20, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
        />
      ))}

      {/* Contenido principal */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm text-sm font-medium text-slate-400">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Plataforma profesional
          </span>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
        >
          <span className="bg-linear-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Common Man
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed"
        >
          La solución elegante para gestionar tu mundo. Diseñada con precisión, construida para durar.
        </motion.p>

        {/* Botones */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="primary"
            size="lg"
            className="group w-full sm:w-auto"
            onClick={() => navigate("/login")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Iniciar Sesión
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate("/register")}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Cuenta
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        © 2026 Common Man. Todos los derechos reservados.
      </motion.div>
    </div>
  );
}