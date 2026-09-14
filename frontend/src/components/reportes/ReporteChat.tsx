import { useState, useRef, useEffect } from "react";
import type { MensajeReporte } from "@/api/types";

interface ReporteChatProps {
  mensajes: MensajeReporte[];
  onEnviarMensaje: (contenido: string) => void;
  isEnviando?: boolean;
  deshabilitado?: boolean;
  mensajeDeshabilitado?: string;
}

function MensajeItem({ mensaje }: { mensaje: MensajeReporte }) {
  const esAdmin = mensaje.rol === "admin";

  const fecha = new Date(mensaje.fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${esAdmin ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
          esAdmin
            ? "bg-gray-100 text-gray-900"
            : "bg-blue-600 text-white"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-semibold ${
              esAdmin ? "text-gray-600" : "text-blue-100"
            }`}
          >
            {esAdmin ? `🛡️ ${mensaje.nombre_usuario}` : "Tú"}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap wrap-break-word">
          {mensaje.contenido}
        </p>
        <p
          className={`mt-1 text-right text-[10px] ${
            esAdmin ? "text-gray-400" : "text-blue-200"
          }`}
        >
          {fecha}
        </p>
      </div>
    </div>
  );
}

export function ReporteChat({
  mensajes,
  onEnviarMensaje,
  isEnviando,
  deshabilitado,
  mensajeDeshabilitado,
}: ReporteChatProps) {
  const [contenido, setContenido] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contenido.trim() || isEnviando || deshabilitado) return;

    onEnviarMensaje(contenido.trim());
    setContenido("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mensajes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">
              No hay mensajes aún. Inicia la conversación.
            </p>
          </div>
        ) : (
          <>
            {mensajes.map((msg, idx) => (
              <MensajeItem key={idx} mensaje={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {deshabilitado ? (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-center text-sm text-gray-500">
            {mensajeDeshabilitado || "Este reporte está cerrado"}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 bg-white px-4 py-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para salto de línea)"
              rows={2}
              maxLength={5000}
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!contenido.trim() || isEnviando}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 self-end"
            >
              {isEnviando ? "..." : "Enviar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}