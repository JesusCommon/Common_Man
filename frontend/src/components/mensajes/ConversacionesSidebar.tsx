import { useState } from "react";
import { MessageSquare, UserPlus, Check, X } from "lucide-react";
import {
  useBandeja,
  useSolicitudes,
  useContadoresMensajes,
  useAceptarSolicitud,
  useRechazarSolicitud,
} from "@/hooks";
import type { ConversacionResponse } from "@/api/types";
import { formatHora } from "@/lib/time";

interface ConversacionesSidebarProps {
  conversacionActivaId: string | null;
  onSelect: (id: string) => void;
}

function AvatarConversacion({ conversacion }: { conversacion: ConversacionResponse }) {
  const otro = conversacion.otro_usuario;
  return (
    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#e4dccd] flex items-center justify-center shrink-0">
      {otro.avatar ? (
        <img src={otro.avatar} alt={otro.username} className="w-full h-full object-cover" />
      ) : (
        <span className="font-editorial text-lg font-semibold text-[#8b8377]">
          {otro.nombre.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export function ConversacionesSidebar({
  conversacionActivaId,
  onSelect,
}: ConversacionesSidebarProps) {
  const [tab, setTab] = useState<"chat" | "solicitudes">("chat");
  const { data: bandeja } = useBandeja();
  const { data: solicitudes } = useSolicitudes();
  const { data: contadores } = useContadoresMensajes();
  const aceptar = useAceptarSolicitud();
  const rechazar = useRechazarSolicitud();

  const nSolicitudes = contadores?.solicitudes_pendientes ?? 0;

  return (
    <aside className="w-80 lg:w-96 border-r border-[#e4dccd] bg-[#fbf9f4] flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#e4dccd]">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition ${
            tab === "chat"
              ? "text-[#b23a2f] border-b-2 border-[#b23a2f]"
              : "text-[#8b8377] hover:text-[#221e19]"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setTab("solicitudes")}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition relative ${
            tab === "solicitudes"
              ? "text-[#b23a2f] border-b-2 border-[#b23a2f]"
              : "text-[#8b8377] hover:text-[#221e19]"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Solicitudes
          {nSolicitudes > 0 && (
            <span className="absolute top-2 right-6 min-w-4.5 h-4.5 px-1 rounded-full bg-[#b23a2f] text-white text-[10px] font-bold flex items-center justify-center">
              {nSolicitudes}
            </span>
          )}
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {tab === "chat" ? (
          bandeja && bandeja.length > 0 ? (
            bandeja.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-[#f3eee5] ${
                  conversacionActivaId === conv.id ? "bg-[#f3eee5]" : ""
                }`}
              >
                <AvatarConversacion conversacion={conv} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-[#221e19] truncate">
                      {conv.otro_usuario.nombre} {conv.otro_usuario.apellido ?? ""}
                    </p>
                    <span className="text-[10px] text-[#8b8377] shrink-0">
                      {formatHora(conv.ultimo_fecha)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b8377] truncate">
                    {conv.ultimo_contenido ?? "Sin mensajes aún"}
                  </p>
                </div>
                {conv.no_leidos_mios > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#b23a2f] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.no_leidos_mios}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <MessageSquare className="w-10 h-10 text-[#e4dccd] mb-3" />
              <p className="text-sm text-[#8b8377]">Aún no tienes conversaciones</p>
            </div>
          )
        ) : solicitudes && solicitudes.length > 0 ? (
          solicitudes.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-[#f3eee5]"
            >
              <AvatarConversacion conversacion={conv} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#221e19] truncate">
                  {conv.otro_usuario.nombre} {conv.otro_usuario.apellido ?? ""}
                </p>
                <p className="text-xs text-[#8b8377] truncate">
                  {conv.ultimo_contenido ?? "Quiere enviarte un mensaje"}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => aceptar.mutate(conv.id)}
                  disabled={aceptar.isPending}
                  className="p-1.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50"
                  title="Aceptar"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => rechazar.mutate(conv.id)}
                  disabled={rechazar.isPending}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                  title="Rechazar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <UserPlus className="w-10 h-10 text-[#e4dccd] mb-3" />
            <p className="text-sm text-[#8b8377]">No tienes solicitudes pendientes</p>
          </div>
        )}
      </div>
    </aside>
  );
}