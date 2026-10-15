import { z } from "zod";

export const MensajeContenidoSchema = z
  .string({ message: "El mensaje es obligatorio" })
  .trim()
  .min(1, "El mensaje no puede estar vacío")
  .max(2000, "El mensaje no puede exceder 2000 caracteres");

export const MensajeUpdateSchema = z.object({
  contenido: MensajeContenidoSchema,
});

export const EnviarMensajeSchema = z.object({
  destinatario_id: z.string().length(24, "ID de usuario inválido"),
  contenido: MensajeContenidoSchema,
});

export type MensajeUpdateInput = z.infer<typeof MensajeUpdateSchema>;
export type EnviarMensajeInput = z.infer<typeof EnviarMensajeSchema>;