import { z } from "zod";

export const EstadoEnvioSchema = z.enum([
  "pendiente",
  "preparando",
  "enviado",
  "en_transito",
  "entregado",
  "cancelado",
]);

export type EstadoEnvio = z.infer<typeof EstadoEnvioSchema>;

const IdRequeridoSchema = (mensaje: string) =>
  z.string({ message: mensaje }).trim().min(1, mensaje);

const TransportadoraSchema = z
  .string()
  .trim()
  .max(100, "La transportadora no puede superar los 100 caracteres")
  .optional();

const NumeroSeguimientoSchema = z
  .string()
  .trim()
  .max(100, "El número de seguimiento no puede superar los 100 caracteres")
  .optional();

const NotasEnvioSchema = z
  .string()
  .trim()
  .max(500, "Las notas no pueden superar los 500 caracteres")
  .optional();

export const EnvioCreateSchema = z.object({
  compra_id: IdRequeridoSchema("La compra es obligatoria"),
  direccion_id: IdRequeridoSchema("La dirección es obligatoria"),
  notas: NotasEnvioSchema,
});

export type EnvioCreateInput = z.infer<typeof EnvioCreateSchema>;

export const EnvioUpdateSchema = z.object({
  transportadora: TransportadoraSchema,
  numero_seguimiento: NumeroSeguimientoSchema,
  fecha_estimada_entrega: z
    .string()
    .trim()
    .min(1, "La fecha estimada es inválida")
    .optional(),
  notas: NotasEnvioSchema,
});

export type EnvioUpdateInput = z.infer<typeof EnvioUpdateSchema>;

export const EnvioEstadoUpdateSchema = z.object({
  estado: EstadoEnvioSchema,
  descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),
});

export type EnvioEstadoUpdateInput = z.infer<typeof EnvioEstadoUpdateSchema>;

export const EventoEnvioSchema = z.object({
  estado: EstadoEnvioSchema,
  descripcion: z.string().nullable(),
  fecha: z.string().datetime(),
});

export type EventoEnvioOutput = z.infer<typeof EventoEnvioSchema>;

export const EnvioResponseSchema = z.object({
  id: z.string(),
  compra_id: z.string(),
  direccion_id: z.string(),
  estado: EstadoEnvioSchema,
  transportadora: z.string().nullable(),
  numero_seguimiento: z.string().nullable(),
  fecha_estimada_entrega: z.string().datetime().nullable(),
  fecha_entrega_real: z.string().datetime().nullable(),
  notas: z.string().nullable(),
  eventos: z.array(EventoEnvioSchema),
  fecha_creacion: z.string().datetime(),
  fecha_actualizacion: z.string().datetime(),
});

export type EnvioResponseOutput = z.infer<typeof EnvioResponseSchema>;

export const EnvioAdminResponseSchema = EnvioResponseSchema.extend({
  usuario_id: z.string(),
  activo: z.boolean(),
});

export type EnvioAdminResponseOutput = z.infer<typeof EnvioAdminResponseSchema>;

export const ListarEnviosSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarEnviosInput = z.infer<typeof ListarEnviosSchema>;