import { z } from "zod";

const ProductoIdSchema = z
  .string({ message: "El ID del producto es obligatorio" })
  .regex(/^[0-9a-fA-F]{24}$/, "El ID del producto debe ser un ObjectId válido");

const CantidadSchema = z
  .number({ message: "La cantidad es obligatoria" })
  .int("La cantidad debe ser un número entero")
  .min(1, "La cantidad mínima es 1")
  .max(999, "La cantidad máxima es 999");

const NotasSchema = z
  .string()
  .trim()
  .max(500, "Las notas no pueden tener más de 500 caracteres");

const DescuentoSchema = z
  .number({ message: "El descuento debe ser un número" })
  .min(0, "El descuento no puede ser negativo");

const ImpuestosSchema = z
  .number({ message: "Los impuestos deben ser un número" })
  .min(0, "Los impuestos no pueden ser negativos");

export const CompraItemCreateSchema = z.object({
  producto_id: ProductoIdSchema,
  cantidad: CantidadSchema,
});

export type CompraItemCreateInput = z.infer<typeof CompraItemCreateSchema>;

export const CompraCreateSchema = z.object({
  items: z
    .array(CompraItemCreateSchema)
    .min(1, "Debe incluir al menos un producto")
    .max(50, "No puede incluir más de 50 productos"),
  notas: NotasSchema.optional(),
  descuento: DescuentoSchema.default(0),
  impuestos: ImpuestosSchema.default(0),
});

export type CompraCreateInput = z.infer<typeof CompraCreateSchema>;

export const CompraUpdateSchema = z.object({
  notas: NotasSchema.optional(),
});

export type CompraUpdateInput = z.infer<typeof CompraUpdateSchema>;

export const EstadoCompraEnumSchema = z.enum([
  "pendiente",
  "pagado",
  "enviado",
  "entregado",
  "cancelado",
]);

export const CompraEstadoUpdateSchema = z.object({
  estado: EstadoCompraEnumSchema,
});

export type CompraEstadoUpdateInput = z.infer<typeof CompraEstadoUpdateSchema>;

export const CompraItemResponseSchema = z.object({
  producto_id: z.string(),
  nombre_producto_snapshot: z.string(),
  cantidad: z.number(),
  precio_unitario: z.number(),
  subtotal: z.number(),
});

export type CompraItemResponseOutput = z.infer<typeof CompraItemResponseSchema>;

export const CompraResponseSchema = z.object({
  id: z.string(),
  numero_orden: z.string(),
  items: z.array(CompraItemResponseSchema),
  subtotal: z.number(),
  descuento: z.number(),
  impuestos: z.number(),
  total: z.number(),
  estado: EstadoCompraEnumSchema,
  notas: z.string().nullable(),
  fecha_creacion: z.string().datetime(),
  fecha_actualizacion: z.string().datetime(),
});

export type CompraResponseOutput = z.infer<typeof CompraResponseSchema>;

export const CompraAdminResponseSchema = CompraResponseSchema.extend({
  usuario_id: z.string(),
});

export type CompraAdminResponseOutput = z.infer<typeof CompraAdminResponseSchema>;

export const ListarComprasSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarComprasInput = z.infer<typeof ListarComprasSchema>;

export const ListarComprasPorEstadoSchema = z.object({
  estado: EstadoCompraEnumSchema,
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarComprasPorEstadoInput = z.infer<typeof ListarComprasPorEstadoSchema>;