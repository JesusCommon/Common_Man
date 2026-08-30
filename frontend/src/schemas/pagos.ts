import { z } from "zod";

export const TipoMovimientoEnumSchema = z.enum([
  "pago_compra",
  "reembolso",
  "recarga",
]);

export type TipoMovimientoEnum = z.infer<typeof TipoMovimientoEnumSchema>;

export const EstadoMovimientoEnumSchema = z.enum([
  "pendiente",
  "completado",
  "cancelado",
]);

export type EstadoMovimientoEnum = z.infer<typeof EstadoMovimientoEnumSchema>;

const CompraIdSchema = z
  .string({ message: "El ID de la compra es obligatorio" })
  .regex(/^[0-9a-fA-F]{24}$/, "El ID de la compra debe ser un ObjectId válido");

export const ProcesarPagoSchema = z.object({
  compraId: CompraIdSchema,
});

export type ProcesarPagoInput = z.infer<typeof ProcesarPagoSchema>;

export const CancelarCompraSchema = z.object({
  compraId: CompraIdSchema,
});

export type CancelarCompraInput = z.infer<typeof CancelarCompraSchema>;

export const ObtenerMovimientoSchema = z.object({
  compraId: CompraIdSchema,
});

export type ObtenerMovimientoInput = z.infer<typeof ObtenerMovimientoSchema>;

export const ListarHistorialSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarHistorialInput = z.infer<typeof ListarHistorialSchema>;

export const MovimientoSaldoResponseSchema = z.object({
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
  fecha_actualizacion: z.string().datetime(),
});

export type MovimientoSaldoResponseOutput = z.infer<typeof MovimientoSaldoResponseSchema>;