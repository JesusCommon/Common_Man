import { useQueryClient } from "@tanstack/react-query";
import { mensajesApi } from "@/api/endpoints/mensajes";

/**
 * Hook para iniciar una conversación con un usuario específico.
 * Si ya existe, la devuelve; si no, la crea con un mensaje de bienvenida.
 */
export function useIniciarConversacion() {
  const queryClient = useQueryClient();

  async function iniciar(destinatarioId: string): Promise<string> {
    if (!destinatarioId) {
      throw new Error("ID de destinatario requerido");
    }

    console.log("🔍 Buscando conversación existente con:", destinatarioId);

    // Primero buscamos si ya existe una conversación
    const bandeja = await mensajesApi.obtenerBandeja(0, 100);
    const existente = bandeja.find((c) => c.otro_usuario.id === destinatarioId);

    if (existente) {
      console.log("✅ Conversación encontrada:", existente.id);
      return existente.id;
    }

    console.log("➕ Creando nueva conversación...");

    // Si no existe, enviamos un mensaje inicial para crearla
    const mensaje = await mensajesApi.enviarMensaje(destinatarioId, {
      contenido: "👋 Hola!",
    });

    console.log("✅ Conversación creada:", mensaje.conversacion_id);

    // Invalidamos para que aparezca en la bandeja
    await queryClient.invalidateQueries({ queryKey: ["mensajes", "bandeja"] });
    await queryClient.invalidateQueries({ queryKey: ["mensajes", "contadores"] });

    return mensaje.conversacion_id;
  }

  return { iniciar };
}