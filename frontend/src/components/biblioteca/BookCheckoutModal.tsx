import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Wallet, AlertCircle, BookOpen } from "lucide-react";
import { useCrearCompra, useProcesarPago, usePerfil } from "@/hooks";
import { extraerMensajeError } from "@/lib/errors";
import type { LibroResponse } from "@/api/types";

const formatPrecio = (precio: string | number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number(precio));

interface BookCheckoutModalProps {
  libro: LibroResponse;
  autor: string;
  onClose: () => void;
  onExito: () => void;
}

type Paso = "resumen" | "exito";

export function BookCheckoutModal({ libro, autor, onClose, onExito }: BookCheckoutModalProps) {
  const navigate = useNavigate();
  const crear = useCrearCompra();
  const pagar = useProcesarPago();
  const perfil = usePerfil();
  const [paso, setPaso] = useState<Paso>("resumen");
  const saldoActual = Number(perfil.data?.saldo ?? 0);
  const precioLibro = Number(libro.precio);
  const saldoSuficiente = saldoActual >= precioLibro;
  const isPending = crear.isPending || pagar.isPending;
  const error = crear.error ?? pagar.error;

  const handleComprar = () => {
    crear.mutate(
      {
        items: [{ producto_id: libro.id, cantidad: 1, tipo: "libro" }],
        direccion_id: undefined,
      },
      {
        onSuccess: (respuesta) => {
          pagar.mutate(
            { compraId: respuesta.data.id },
            {
              onSuccess: () => {
                onExito();
                perfil.refetch();
                setPaso("exito");
              },
            }
          );
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-70 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-[#1e1b16]/60 backdrop-blur-sm"
          onClick={() => !isPending && onClose()}
        />

        <motion.div
          className="relative w-full max-w-md rounded-3xl bg-[#fbf9f4] shadow-[0_40px_90px_rgba(20,17,13,0.45)] overflow-hidden"
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {paso === "resumen" ? (
            <div className="p-8 space-y-6">
              <button
                onClick={onClose}
                disabled={isPending}
                className="absolute top-4 right-4 p-2 rounded-full text-[#8b8377] hover:bg-[#f3eee5] transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-24 rounded-md overflow-hidden bg-[#2e2a24] shadow-lg shrink-0">
                  {libro.portada ? (
                    <img
                      src={libro.portada}
                      alt={libro.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-editorial w-full h-full flex items-center justify-center text-2xl text-[#f3eee5]">
                      {libro.nombre.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b23a2f] font-semibold">
                    Libro digital
                  </p>
                  <h3 className="font-editorial text-lg font-semibold text-[#221e19] leading-tight line-clamp-2">
                    {libro.nombre}
                  </h3>
                  <p className="text-xs text-[#8b8377] mt-0.5">{autor}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e4dccd] bg-[#f3eee5] p-4 space-y-2">
                <div className="flex justify-between text-sm text-[#52525B]">
                  <span>Precio del libro</span>
                  <span className="font-semibold text-[#221e19]">{formatPrecio(precioLibro)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#52525B]">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-medium">Digital · Gratis</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#221e19] pt-2 border-t border-[#e4dccd]">
                  <span>Total</span>
                  <span>{formatPrecio(precioLibro)}</span>
                </div>
              </div>

              <div
                className={`rounded-xl border p-3 flex items-center justify-between ${
                  saldoSuficiente
                    ? "border-[#e4dccd] bg-[#f3eee5]"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <span className="flex items-center gap-2 text-sm text-[#52525B]">
                  <Wallet className="w-4 h-4" />
                  Tu saldo actual
                </span>
                <span
                  className={`text-sm font-bold ${
                    saldoSuficiente ? "text-[#221e19]" : "text-amber-700"
                  }`}
                >
                  {formatPrecio(saldoActual)}
                </span>
              </div>

              {!saldoSuficiente && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2">
                  <p className="flex items-start gap-2 text-sm text-amber-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    Saldo insuficiente. Te faltan {formatPrecio(precioLibro - saldoActual)}.
                  </p>
                  <button
                    onClick={() => navigate("/recargar")}
                    className="text-xs font-medium text-amber-700 underline hover:no-underline"
                  >
                    Recargar saldo →
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 space-y-2">
                  <p className="flex items-start gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {extraerMensajeError(error)}
                  </p>
                  <button
                    onClick={() => navigate("/recargar")}
                    className="text-xs font-medium text-red-700 underline hover:no-underline"
                  >
                    Recargar saldo →
                  </button>
                </div>
              )}

              <button
                onClick={handleComprar}
                disabled={isPending || !saldoSuficiente}
                className="w-full rounded-full bg-[#b23a2f] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#963026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? "Procesando compra…"
                  : `Comprar y leer por ${formatPrecio(precioLibro)}`}
              </button>

              <p className="text-center text-[11px] text-[#8b8377]">
                Compra digital. Sin dirección de envío necesaria.
              </p>
            </div>
          ) : (
            <div className="p-10 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="font-editorial text-2xl font-semibold text-[#221e19]">
                ¡Listo para leer!
              </h3>
              <p className="text-sm text-[#8b8377]">
                Tu compra fue procesada. El contenido de{" "}
                <span className="font-medium text-[#221e19]">{libro.nombre}</span> ya está
                desbloqueado.
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-[#221e19] px-6 py-3 text-sm font-medium text-[#f3eee5] hover:bg-[#b23a2f] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Leer ahora
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}