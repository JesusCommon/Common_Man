import { useEffect, useRef, useState } from "react";
import { useCrearGenero, useActualizarGenero } from "@/hooks";
import { X } from "lucide-react";
import type { GeneroResponse } from "@/api/types";
import { extraerMensajeError } from "@/lib/errors";

interface GeneroFormModalProps {
  abierto: boolean;
  genero: GeneroResponse | null;
  onClose: () => void;
}

export function GeneroFormModal({ abierto, genero, onClose }: GeneroFormModalProps) {
  const crear = useCrearGenero();
  const actualizar = useActualizarGenero();
  const [nombre, setNombre] = useState(genero?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(genero?.descripcion ?? "");

  const prevId = useRef(genero?.id);
  useEffect(() => {
    if (genero?.id !== prevId.current) {
      setNombre(genero?.nombre ?? "");
      setDescripcion(genero?.descripcion ?? "");
      prevId.current = genero?.id;
    }
  }, [genero]);

  const isPending = crear.isPending || actualizar.isPending;
  const error = crear.error || actualizar.error;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nombre,
      descripcion: descripcion.trim() ? descripcion.trim() : undefined,
    };

    if (genero) {
      actualizar.mutate({ id: genero.id, data: payload }, { onSuccess: onClose });
    } else {
      crear.mutate(payload, { onSuccess: onClose });
    }
  }

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#18181B]">
            {genero ? "Editar género" : "Nuevo género"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4F4F5] text-[#A1A19A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#52525B]">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={150}
              className="w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#52525B]">
              Descripción <span className="font-normal text-[#A1A19A]">(opcional)</span>
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm resize-none focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
            <p className="mt-1 text-xs text-[#A1A19A] text-right">{descripcion.length}/1000</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{extraerMensajeError(error)}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E4E4E1] px-4 py-2 text-sm font-medium text-[#52525B] hover:bg-[#FAFAF8] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !nombre.trim()}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition disabled:opacity-50"
            >
              {isPending ? "Guardando..." : genero ? "Guardar cambios" : "Crear género"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}