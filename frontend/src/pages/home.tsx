import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { ModuleNetwork } from "@/components/layout/ModuleNetwork";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Home() {
  const navigate = useNavigate();

  return (
    // CAMBIO 1: h-dvh (dynamic viewport height) y overflow-hidden para evitar scroll a toda costa
    <div className="h-dvh w-full bg-[#FAFAF8] text-[#18181B] flex flex-col overflow-hidden">
      
      {/* Header: padding vertical reducido (py-4) y shrink-0 para que no se encoja */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-7xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#18181B] flex items-center justify-center">
            <span className="text-[#FAFAF8] text-xs font-bold font-[Space_Grotesk]">C</span>
          </div>
          <span className="font-[Space_Grotesk] font-medium text-sm tracking-tight">common man</span>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-[#52525B] hover:text-[#18181B] transition-colors"
          >
            Iniciar sesión
          </button>
          <Button
            size="sm"
            className="group bg-[#18181B] text-[#FAFAF8] hover:bg-[#18181B]/90 border-0"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </nav>
      </header>

      {/* Main: flex-1 ocupa todo el espacio restante. Padding y gap reducidos para evitar desbordamiento */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-10 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center">
        
        {/* Columna izquierda: copy */}
        <div className="flex flex-col justify-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#2563EB] bg-[#EFF4FE] px-3 py-1 rounded-full mb-4 w-fit"
          >
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            Sistema de simulación en vivo
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            // CAMBIO 2: Tamaños de fuente ligeramente ajustados para mejor proporción sin scroll
            className="font-[Space_Grotesk] text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight mb-4"
          >
            Un sistema que
            <br />
            se construye
            <br />
            módulo a módulo.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-[#52525B] text-sm sm:text-base leading-relaxed max-w-md mb-6"
          >
            Common Man simula una plataforma real: usuarios, relaciones, categorías
            y productos, todo conectado en un mismo panel de administración.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex items-center gap-4"
          >
            {/* CAMBIO 3: Botón 1: Negro con letras blancas */}
            <Button
              size="lg"
              className="group bg-[#18181B] text-[#FAFAF8] hover:bg-[#18181B]/90 border-0 shadow-sm"
              onClick={() => navigate("/register")}
            >
              Empezar ahora
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Button>
            
            {/* CAMBIO 4: Botón 2: Blanco con letras negras (y borde sutil para que se note sobre el fondo) */}
            <Button
              size="lg"
              className="bg-[#FFFFFF] text-[#18181B] border border-[#E4E4E1] hover:bg-[#F4F4F5] hover:text-[#18181B] shadow-sm"
              onClick={() => navigate("/login")}
            >
              Ya tengo cuenta
            </Button>
          </motion.div>
        </div>

        {/* Columna derecha: red de módulos animada */}
        {/* CAMBIO 5: Restringir altura máxima para que quepa siempre en pantalla */}
        <motion.div
          className="w-full h-full max-h-112.5 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ModuleNetwork />
        </motion.div>
      </main>

      {/* Footer: shrink-0 y padding reducido */}
      <footer className="shrink-0 text-center text-xs text-[#A1A19A] pb-4">
        © 2026 Common Man
      </footer>
    </div>
  );
}