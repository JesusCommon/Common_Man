import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, ExternalLink, ShoppingCart } from "lucide-react";
import { useObtenerContenidoLibro } from "@/hooks";
import { extraerMensajeError } from "@/lib/errors";
import type { LibroResponse } from "@/api/types";

const EASE = [0.66, 0, 0.34, 1] as const;

const coverVariants = {
  closed: { rotateY: 0 },
  open: { rotateY: -165, transition: { duration: 1.15, ease: EASE } },
};

const pageVariants = (delay: number) => ({
  closed: { rotateY: 0 },
  open: { rotateY: -150, transition: { duration: 0.9, ease: EASE, delay } },
});

const formatPrecio = (precio: string | number): string =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(Number(precio));

function Book3D({ portada, nombre, onOpenComplete }: { portada?: string; nombre: string; onOpenComplete: () => void }) {
  return (
    <motion.div style={{ perspective: 2200 }} className="flex justify-center md:justify-start pt-4">
      <div className="relative w-65 md:w-75 aspect-2/3" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute left-[6%] right-[6%] -bottom-6 h-6 rounded-[50%] blur-[6px] bg-[radial-gradient(ellipse_at_center,rgba(34,30,25,0.28),transparent_70%)]" />
        <div className="absolute inset-0 rounded-r-xl bg-[#efe8da] shadow-[0_24px_60px_rgba(34,30,25,0.25)]" />
        <motion.div
          className="absolute inset-[2%_2%_2%_3.5%] rounded-r-lg bg-[#fdfbf6] bg-[repeating-linear-gradient(to_bottom,transparent_0_18px,rgba(34,30,25,0.07)_18px_19px)]"
          style={{ transformOrigin: "left center" }}
          variants={pageVariants(0.68)}
          initial="closed"
          animate="open"
        />
        <motion.div
          className="absolute inset-[2%_2%_2%_3.5%] rounded-r-lg bg-[#fdfbf6] bg-[repeating-linear-gradient(to_bottom,transparent_0_18px,rgba(34,30,25,0.07)_18px_19px)]"
          style={{ transformOrigin: "left center" }}
          variants={pageVariants(0.5)}
          initial="closed"
          animate="open"
        />
        {/* Portada con doble cara */}
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          variants={coverVariants}
          initial="closed"
          animate="open"
          onAnimationComplete={onOpenComplete}
        >
          <div
            className="absolute inset-0 rounded-r-xl bg-cover bg-center"
            style={{ backgroundImage: portada ? `url(${portada})` : undefined, backfaceVisibility: "hidden" }}
          >
            {!portada && (
              <span className="font-editorial absolute inset-0 flex items-center justify-center text-6xl text-[#f3eee5] bg-linear-to-br from-[#3a352d] to-[#221e19]">
                {nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div
            className="absolute inset-0 rounded-r-xl bg-[#fbf9f4] flex flex-col items-center justify-center gap-1.5 p-5 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="font-editorial text-lg font-semibold text-[#221e19] leading-tight">{nombre}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------- Modal ---------- */
interface BookOpenModalProps {
  libro: LibroResponse;
  autor: string;
  genero: string;
  onClose: () => void;
}

export function BookOpenModal({ libro, autor, genero, onClose }: BookOpenModalProps) {
  const navigate = useNavigate();
  const [cerrando, setCerrando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [intentandoLeer, setIntentandoLeer] = useState(false);

  const contenido = useObtenerContenidoLibro(intentandoLeer ? libro.id : "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCerrando(true);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {!cerrando && (
        <motion.div
          key="book-modal"
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#1e1b16]/55 backdrop-blur-md"
            onClick={() => setCerrando(true)}
          />

          <motion.div
            className="relative w-full max-w-215 max-h-[90vh] overflow-y-auto rounded-3xl bg-[#fbf9f4] shadow-[0_40px_90px_rgba(20,17,13,0.4)]"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <button
              onClick={() => setCerrando(true)}
              className="absolute top-4 right-4 z-40 p-2 rounded-full text-[#8b8377] hover:bg-[#f3eee5] hover:text-[#221e19] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-12">
              <Book3D portada={libro.portada ?? undefined} nombre={libro.nombre} onOpenComplete={() => setAbierto(true)} />

              <AnimatePresence>
                {abierto && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[#b23a2f] font-semibold">
                      {genero || "Libro"} · {libro.anio_publicacion}
                    </p>
                    <h2 className="font-editorial mt-2 text-3xl md:text-4xl font-semibold leading-tight text-[#221e19]">
                      {libro.nombre}
                    </h2>
                    <p className="mt-1 text-sm text-[#8b8377]">
                      {autor}
                      {libro.edicion ? ` · ${libro.edicion}` : ""}
                    </p>

                    {libro.descripcion && (
                      <p className="mt-4 text-sm leading-relaxed text-[#221e19]/80 line-clamp-5">{libro.descripcion}</p>
                    )}

                    <div className="mt-5 flex items-center gap-4 text-xs text-[#8b8377]">
                      <span>{libro.paginas} páginas</span>
                      <span className="w-px h-3 bg-[#e4dccd]" />
                      <span>{libro.idioma}</span>
                      <span className="w-px h-3 bg-[#e4dccd]" />
                      <span className="text-[#221e19] font-semibold">{formatPrecio(libro.precio)}</span>
                    </div>

                    <div className="mt-6 space-y-3">
                      {!intentandoLeer && (
                        <button
                          onClick={() => setIntentandoLeer(true)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#221e19] px-6 py-3 text-sm font-medium text-[#f3eee5] hover:bg-[#b23a2f] transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Leer libro
                        </button>
                      )}

                      {intentandoLeer && contenido.isLoading && (
                        <p className="text-sm text-[#8b8377]">Verificando tu acceso…</p>
                      )}

                      {contenido.isSuccess && (
                        <a
                          href={String(contenido.data.contenido)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#b23a2f] px-6 py-3 text-sm font-medium text-white hover:bg-[#963026] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Abrir contenido
                        </a>
                      )}

                      {contenido.isError && (
                        <div className="rounded-xl border border-[#e4dccd] bg-[#f3eee5] p-4 space-y-3">
                          <p className="text-sm text-[#221e19]">{extraerMensajeError(contenido.error)}</p>
                          <button
                            onClick={() => navigate("/tienda")}
                            className="inline-flex items-center gap-2 rounded-full bg-[#221e19] px-5 py-2.5 text-sm font-medium text-[#f3eee5] hover:bg-[#b23a2f] transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Comprar por {formatPrecio(libro.precio)}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}