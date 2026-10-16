import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import {
  useDetalleConversacion,
  useHistorialMensajes,
  useEnviarMensaje,
  useMarcarComoLeido,
  useEditarMensaje,
  useEliminarMensaje,
  useOcultarMensaje,
} from "@/hooks";
import { useAuthStore } from "@/store";
import { MensajeBubble } from "./MensajeBubble";
import { MensajeInput } from "./MensajeInput";
import { Spinner } from "@/components/ui/Spinner";

interface ChatWindowProps {
  conversacionId: string | null;
  onCerrar: () => void;
}

export function ChatWindow({ conversacionId, onCerrar }: ChatWindowProps) {
  const user = useAuthStore((s) => s.user);
  const { 
    data: detalle, 
    isLoading: isLoadingDetalle, 
    error: errorDetalle,
    refetch: refetchDetalle 
  } = useDetalleConversacion(conversacionId);
  
  const { 
    data: historial, 
    isLoading: isLoadingHistorial,
    refetch: refetchHistorial 
  } = useHistorialMensajes(conversacionId);
  
  const enviar = useEnviarMensaje();
  const marcarComoLeido = useMarcarComoLeido();
  const editar = useEditarMensaje();
  const eliminar = useEliminarMensaje();
  const ocultar = useOcultarMensaje();

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editandoTexto, setEditandoTexto] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const miId = user?.id ?? null;

  // Auto-scroll al final cuando llega el historial
  useEffect(() => {
    if (scrollRef.current && historial?.length) {
      scrollRef.current.scrollTo({ 
        top: scrollRef.current.scrollHeight,
        behavior: "smooth" 
      });
    }
  }, [historial?.length, conversacionId]);

  // Marcar como leído al abrir / al recibir mensajes nuevos
  useEffect(() => {
    if (!historial || !miId || !conversacionId || marcarComoLeido.isPending) return;
    
    const hayNoLeidos = historial.some((m) => m.remitente_id !== miId && !m.leido);
    if (hayNoLeidos) {
      marcarComoLeido.mutate(conversacionId);
    }
  }, [historial, miId, conversacionId, marcarComoLeido.isPending]);

  // Estado vacío
  if (!conversacionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f3eee5] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-[#e4dccd] flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-[#8b8377]" />
        </div>
        <h2 className="font-editorial text-xl font-semibold text-[#221e19]">
          Selecciona una conversación
        </h2>
        <p className="mt-1 text-sm text-[#8b8377]">
          Elige un chat de la izquierda para comenzar a escribir
        </p>
      </div>
    );
  }

  // Estado de carga inicial
  if (isLoadingDetalle) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f3eee5]">
        <Spinner />
      </div>
    );
  }

  // Estado de error
  if (errorDetalle || !detalle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f3eee5] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="font-editorial text-xl font-semibold text-[#221e19]">
          Error al cargar conversación
        </h2>
        <p className="mt-1 text-sm text-[#8b8377] mb-4">
          {errorDetalle?.message || "No se pudo cargar el chat"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              refetchDetalle();
              refetchHistorial();
            }}
            className="px-4 py-2 rounded-lg border border-[#e4dccd] text-[#221e19] hover:bg-[#f3eee5] transition"
          >
            Reintentar
          </button>
          <button
            onClick={onCerrar}
            className="px-4 py-2 rounded-lg bg-[#b23a2f] text-white hover:bg-[#8f2d24] transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  function handleEnviar(contenido: string) {
    if (!detalle || !miId) return;
    enviar.mutate(
      { destinatario_id: detalle.otro_usuario.id, contenido },
      {
        onSuccess: () => {
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ 
                top: scrollRef.current.scrollHeight,
                behavior: "smooth" 
              });
            }
          }, 100);
        },
      }
    );
  }

  function handleGuardarEdicion(mensajeId: string) {
    const limpio = editandoTexto.trim();
    if (!limpio) return;
    editar.mutate(
      { mensajeId, contenido: limpio },
      { onSuccess: () => setEditandoId(null) }
    );
  }

  const isLoading = isLoadingHistorial;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f3eee5]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#e4dccd]">
        <button
          onClick={onCerrar}
          className="p-1.5 rounded-lg text-[#8b8377] hover:bg-[#f3eee5] lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e4dccd] flex items-center justify-center">
          {detalle?.otro_usuario.avatar ? (
            <img
              src={detalle.otro_usuario.avatar}
              alt={detalle.otro_usuario.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-editorial font-semibold text-[#8b8377]">
              {detalle?.otro_usuario.nombre.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#221e19] truncate">
            {detalle?.otro_usuario.nombre} {detalle?.otro_usuario.apellido ?? ""}
          </p>
          <p className="text-xs text-[#8b8377] truncate">
            @{detalle?.otro_usuario.username}
          </p>
        </div>
      </div>

      {/* Historial */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : historial && historial.length > 0 ? (
          historial.map((mensaje) =>
            editandoId === mensaje.id ? (
              <div key={mensaje.id} className="flex justify-end">
                <div className="max-w-[75%] w-full space-y-2">
                  <textarea
                    value={editandoTexto}
                    onChange={(e) => setEditandoTexto(e.target.value)}
                    rows={2}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-[#b23a2f] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#b23a2f]"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditandoId(null)}
                      className="px-3 py-1 text-xs rounded-lg border border-[#e4dccd] text-[#8b8377] hover:bg-[#f3eee5]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleGuardarEdicion(mensaje.id)}
                      disabled={editar.isPending || !editandoTexto.trim()}
                      className="px-3 py-1 text-xs rounded-lg bg-[#b23a2f] text-white hover:bg-[#8f2d24] disabled:opacity-50"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <MensajeBubble
                key={mensaje.id}
                mensaje={mensaje}
                esMio={mensaje.remitente_id === miId}
                onEditar={() => {
                  setEditandoId(mensaje.id);
                  setEditandoTexto(mensaje.contenido ?? "");
                }}
                onEliminar={() => eliminar.mutate(mensaje.id)}
                onOcultar={() => ocultar.mutate(mensaje.id)}
              />
            )
          )
        ) : (
          <p className="text-center text-sm text-[#8b8377] py-10">
            Aún no hay mensajes en esta conversación
          </p>
        )}
      </div>

      {/* Input */}
      <MensajeInput onEnviar={handleEnviar} disabled={enviar.isPending} />
    </div>
  );
}