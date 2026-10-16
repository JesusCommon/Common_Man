import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store";
import { wsManager } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";
import type {
  MensajeNuevoWS,
  SolicitudNuevaWS,
  SolicitudProcesadaWS,
  MensajeLeidoWS,
  MensajeEditadoWS,
  MensajeEliminadoWS,
} from "@/api/types/mensajes";

export function useWebSocket() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const previousTokenRef = useRef<string | null>(null);
  const miId = user?.id ?? null;

  useEffect(() => {
    if (!accessToken) {
      wsManager.disconnect();
      previousTokenRef.current = null;
      return;
    }

    if (previousTokenRef.current === accessToken) return;
    
    previousTokenRef.current = accessToken;
    wsManager.disconnect();

    wsManager.connect(accessToken, {
      // Notificaciones existentes
      onNotification: () => {
        queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
      },
      onNotificationUpdated: () => {
        queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
      },
      onSaldoActualizado: (data: { saldo: number }) => {
        useAuthStore.getState().updateUser({ saldo: data.saldo });
      },

      // Mensajería
      onMensajeNuevo: (data: Omit<MensajeNuevoWS, 'tipo'>) => {
        queryClient.invalidateQueries({ queryKey: ["mensajes", "bandeja"] });
        queryClient.invalidateQueries({
          queryKey: ["mensajes", "historial", data.conversacion_id],
        });
        queryClient.invalidateQueries({ queryKey: ["mensajes", "contadores"] });
      },
      onSolicitudNueva: (data: Omit<SolicitudNuevaWS, 'tipo'>) => {
        queryClient.invalidateQueries({ queryKey: ["mensajes", "solicitudes"] });
        queryClient.invalidateQueries({ queryKey: ["mensajes", "contadores"] });
      },
      onSolicitudProcesada: (data: Omit<SolicitudProcesadaWS, 'tipo'>) => {
        queryClient.invalidateQueries({ queryKey: ["mensajes", "bandeja"] });
        queryClient.invalidateQueries({ queryKey: ["mensajes", "solicitudes"] });
        queryClient.invalidateQueries({ queryKey: ["mensajes", "contadores"] });
        queryClient.invalidateQueries({
          queryKey: ["mensajes", "detalle", data.conversacion_id],
        });
      },
      onMensajeLeido: (data: Omit<MensajeLeidoWS, 'tipo'>) => {
        queryClient.invalidateQueries({ queryKey: ["mensajes", "bandeja"] });
        queryClient.invalidateQueries({
          queryKey: ["mensajes", "historial", data.conversacion_id],
        });
      },
      onMensajeEditado: (data: Omit<MensajeEditadoWS, 'tipo'>) => {
        queryClient.invalidateQueries({
          queryKey: ["mensajes", "historial", data.conversacion_id],
        });
        queryClient.invalidateQueries({ queryKey: ["mensajes", "bandeja"] });
      },
      onMensajeEliminado: (data: Omit<MensajeEliminadoWS, 'tipo'>) => {
        queryClient.invalidateQueries({
          queryKey: ["mensajes", "historial", data.conversacion_id],
        });
        queryClient.invalidateQueries({ queryKey: ["mensajes", "bandeja"] });
      },
    });

    return () => {
      wsManager.disconnect();
      previousTokenRef.current = null;
    };
  }, [accessToken, miId, queryClient]);
}