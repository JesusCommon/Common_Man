import { useState } from "react";
import { useActualizarEstadoReporteAdmin } from "@/hooks";
import type { EstadoReporteEnum } from "@/api/types";

interface ActualizarEstadoModalProps {
  reporteId: string;
  estadoActual: EstadoReporteEnum;
  onClose: () => void;
}

const ESTADOS: { value: EstadoReporteEnum; label: string; icon: string }[] = [
  { value: "en_progreso", label: "En progreso", icon: "🔄" },
  { value: "resuelto", label: "Resuelto", icon: "✅" },
  { value: "cerrado", label: "Cerrado", icon: "🔒" },
];

export function ActualizarEstadoModal({
  reporteId,
  estadoActual,
  onClose,
}: ActualizarEstadoModalProps) {
  const [estado, setEstado] = useState<EstadoReporteEnum>(estadoActual);
  const [mensajeResolucion, setMensajeResolucion] = useState("");
  const actualizarEstado = useActualizarEstadoReporteAdmin(reporteId);

  const esResolucion = estado === "resuelto" || estado === "cerrado";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    actualizarEstado.mutate(
      {
        estado,
        mensaje_resolucion: mensajeResolucion.trim() || undefined,
      },
      {
        onSuccess: onClose,
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actualizar estado del reporte
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo estado <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ESTADOS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEstado(value)}
                  className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                    estado === value
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="block text-lg mb-0.5">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {esResolucion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje final{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={mensajeResolucion}
                onChange={(e) => setMensajeResolucion(e.target.value)}
                placeholder="Explica al usuario cómo se resolvió su problema..."
                rows={3}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {mensajeResolucion.length}/2000
              </p>
            </div>
          )}

          {actualizarEstado.isError && (
            <p className="text-sm text-red-500">
              Error al actualizar el estado. Intenta nuevamente.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actualizarEstado.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {actualizarEstado.isPending ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}