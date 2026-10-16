import { Pencil, Trash2, EyeOff } from "lucide-react";
import type { MensajeResponse } from "@/api/types";
import { formatHora } from "@/lib/time";

interface MensajeBubbleProps {
  mensaje: MensajeResponse;
  esMio: boolean;
  onEditar: () => void;
  onEliminar: () => void;
  onOcultar: () => void;
}

export function MensajeBubble({
  mensaje,
  esMio,
  onEditar,
  onEliminar,
  onOcultar,
}: MensajeBubbleProps) {
  const eliminado = mensaje.eliminado;

  return (
    <div className={`group flex ${esMio ? "justify-end" : "justify-start"}`}>
      <div className={`relative max-w-[75%] ${esMio ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
            eliminado
              ? "bg-[#f3eee5] text-[#8b8377] italic border border-dashed border-[#e4dccd]"
              : esMio
              ? "bg-[#221e19] text-[#f3eee5] rounded-br-sm"
              : "bg-white text-[#221e19] border border-[#e4dccd] rounded-bl-sm"
          }`}
        >
          {eliminado ? "Este mensaje fue eliminado" : mensaje.contenido}
          {!eliminado && mensaje.editado && (
            <span className={`ml-2 text-[10px] ${esMio ? "text-[#8b8377]" : "text-[#8b8377]"}`}>
              (editado)
            </span>
          )}
        </div>

        <div
          className={`mt-0.5 text-[10px] text-[#8b8377] ${
            esMio ? "text-right" : "text-left"
          }`}
        >
          {formatHora(mensaje.fecha_creacion)}
        </div>

        {/* Acciones en hover (solo mis mensajes no eliminados) */}
        {esMio && !eliminado && (
          <div
            className={`absolute top-0 ${
              esMio ? "-left-24" : "-right-24"
            } hidden group-hover:flex gap-1 bg-white border border-[#e4dccd] rounded-full px-2 py-1 shadow-sm`}
          >
            <button
              onClick={onEditar}
              className="p-1 text-[#8b8377] hover:text-[#2563EB] transition"
              title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOcultar}
              className="p-1 text-[#8b8377] hover:text-[#b23a2f] transition"
              title="Ocultar solo para mí"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onEliminar}
              className="p-1 text-[#8b8377] hover:text-red-600 transition"
              title="Eliminar para todos"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}