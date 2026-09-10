import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useListarMisNotificaciones,
  useContarNoLeidas,
  useMarcarNotificacionLeida,
  useMarcarTodasNotificacionesLeidas,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Bell, Check, ExternalLink } from "lucide-react";
import type { NotificacionResponse } from "@/api/types";

export function NotificacionesDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const countQuery = useContarNoLeidas();
  const listQuery = useListarMisNotificaciones({ skip: 0, limit: 5 }, );
  const marcarLeida = useMarcarNotificacionLeida();
  const marcarTodas = useMarcarTodasNotificacionesLeidas();
  const countNoLeidas = countQuery.data ?? 0;
  const notificaciones: NotificacionResponse[] = listQuery.data?.items ?? [];

  const handleNotificacionClick = (notif: NotificacionResponse) => {
    if (!notif.leida) {
      marcarLeida.mutate(notif.id);
    }
    if (notif.accion_url) {
      navigate(notif.accion_url);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full bg-[#FAFAF8] border border-[#E4E4E1] flex items-center justify-center hover:bg-[#F4F4F5] transition-colors"
      >
        <Bell className="w-4 h-4 text-[#52525B]" />
        {countNoLeidas > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2563EB] rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E4E4E1] rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F4F4F5]">
            <h3 className="text-sm font-semibold text-[#18181B]">Notificaciones</h3>
            {countNoLeidas > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => marcarTodas.mutate()}
                disabled={marcarTodas.isPending}
                className="text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {listQuery.isLoading ? (
              <div className="p-4 text-center text-sm text-[#A1A19A]">Cargando...</div>
            ) : notificaciones.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#A1A19A]">Sin notificaciones</div>
            ) : (
              notificaciones.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificacionClick(notif)}
                  className={`w-full text-left px-4 py-3 border-b border-[#F4F4F5] hover:bg-[#FAFAF8] transition-colors ${
                    !notif.leida ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !notif.leida ? "bg-[#2563EB]" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#18181B] truncate">{notif.titulo}</p>
                      <p className="text-xs text-[#52525B] line-clamp-2 mt-0.5">{notif.mensaje}</p>
                      <p className="text-[10px] text-[#A1A19A] mt-1">
                        {new Date(notif.fecha_creacion).toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => {
              navigate("/notificaciones");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-xs font-medium text-[#2563EB] hover:bg-[#EFF4FE] transition-colors flex items-center justify-center gap-1.5"
          >
            Ver todas
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}