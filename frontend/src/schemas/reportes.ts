import { z } from "zod";

export const ReporteCreateSchema = z.object({
  categoria: z.enum([
    "compra",
    "producto",
    "pago",
    "envio",
    "cuenta",
    "otro",
  ]),
  asunto: z
    .string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(200, "El asunto no puede exceder 200 caracteres")
    .transform((v) => v.trim()),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(5000, "La descripción no puede exceder 5000 caracteres")
    .transform((v) => v.trim()),
  codigo_referencia: z
    .string()
    .max(50, "El código no puede exceder 50 caracteres")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
});

export type ReporteCreateInput = z.infer<typeof ReporteCreateSchema>;

export const MensajeCreateSchema = z.object({
  contenido: z
    .string()
    .min(1, "El mensaje no puede estar vacío")
    .max(5000, "El mensaje no puede exceder 5000 caracteres")
    .transform((v) => v.trim()),
});

export type MensajeCreateInput = z.infer<typeof MensajeCreateSchema>;

export const ReporteEstadoUpdateSchema = z.object({
  estado: z.enum(["abierto", "en_progreso", "resuelto", "cerrado"]),
  mensaje_resolucion: z
    .string()
    .max(2000, "El mensaje no puede exceder 2000 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ReporteEstadoUpdateInput = z.infer<typeof ReporteEstadoUpdateSchema>;

export const ListarReportesParamsSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarReportesParamsInput = z.infer<typeof ListarReportesParamsSchema>;