import { z } from "zod";
import { TipoMovimientoEnumSchema, EstadoMovimientoEnumSchema } from "./pagos";

export const WalletResponseSchema = z.object({
  saldo_plataforma: z.number(),
  total_transacciones: z.number(),
  fecha_actualizacion: z.string().datetime(),
});

export type WalletResponseOutput = z.infer<typeof WalletResponseSchema>;

export const HistorialItemResponseSchema = z.object({
  id: z.string(),
  usuario_id: z.string(),
  compra_id: z.string().nullable(),
  tipo: TipoMovimientoEnumSchema,
  estado: EstadoMovimientoEnumSchema,
  monto: z.number(),
  saldo_anterior: z.number(),
  saldo_posterior: z.number(),
  descripcion: z.string().nullable(),
  fecha_creacion: z.string().datetime(),
});

export type HistorialItemResponseOutput = z.infer<typeof HistorialItemResponseSchema>;

export const ListarHistorialFinancieroSchema = z.object({
  tipo: TipoMovimientoEnumSchema.optional(),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarHistorialFinancieroInput = z.infer<typeof ListarHistorialFinancieroSchema>;