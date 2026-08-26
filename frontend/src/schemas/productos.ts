import { z } from "zod";

const NombreProductoSchema = z
  .string({ message: "El nombre es obligatorio" })
  .trim()
  .min(2, "El nombre tiene que tener al menos 2 caracteres")
  .max(200, "El nombre no puede superar los 200 caracteres")
  .regex(/^[A-Za-zÀ-ÿñÑ0-9\s]+$/, "El nombre solo puede llevar letras y numeros");

const SlugProductoSchema = z
  .string()
  .trim()
  .min(1, "El slug es obligatorio")
  .max(220, "El slug no puede superar los 220 caracteres")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener minúsculas, números y guiones");

const DescripcionProductoSchema = z
  .string()
  .trim()
  .max(2000, "La descripcion no puede superar los 2000 caracteres");

const DescripcionBreveProductoSchema = z
  .string()
  .trim()
  .max(300, "La descripcion breve no puede superar los 300 caracteres");

const PrecioProductoSchema = z
  .number({ message: "El precio debe ser un número" })
  .positive("El precio debe ser mayor a 0");

const StockProductoSchema = z
  .number({ message: "El stock debe ser un número" })
  .int("El stock debe ser un número entero")
  .nonnegative("El stock no puede ser negativo");

const ImagenProductoSchema = z
  .string()
  .trim()
  .max(500, "La URL de la imagen no puede superar los 500 caracteres")
  .url("La imagen debe ser una URL válida");

const CategoriaIdProductoSchema = z
  .string({ message: "La categoría es obligatoria" })
  .trim()
  .min(1, "La categoría es obligatoria");

export const ProductoCreateSchema = z.object({
  nombre: NombreProductoSchema,
  slug: SlugProductoSchema.optional(),
  descripcion: DescripcionProductoSchema.optional(),
  descripcion_breve: DescripcionBreveProductoSchema.optional(),
  precio: PrecioProductoSchema,
  stock: StockProductoSchema.default(0),
  imagen: ImagenProductoSchema.optional(),
  categoria_id: CategoriaIdProductoSchema,
});

export type ProductoCreateInput = z.infer<typeof ProductoCreateSchema>;

export const ProductoUpdateSchema = z.object({
  nombre: NombreProductoSchema.optional(),
  slug: SlugProductoSchema.optional(),
  descripcion: DescripcionProductoSchema.optional(),
  descripcion_breve: DescripcionBreveProductoSchema.optional(),
  precio: PrecioProductoSchema.optional(),
  stock: StockProductoSchema.optional(),
  imagen: ImagenProductoSchema.optional(),
  categoria_id: CategoriaIdProductoSchema.optional(),
});

export type ProductoUpdateInput = z.infer<typeof ProductoUpdateSchema>;

export const ProductoStockUpdateSchema = z.object({
  delta: z
    .number({ message: "El delta debe ser un número" })
    .int("El delta debe ser un número entero"),
});

export type ProductoStockUpdateInput = z.infer<typeof ProductoStockUpdateSchema>;

export const ProductoPublicResponseSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  slug: z.string(),
  descripcion_breve: z.string().nullable(),
  precio: z.number(),
  stock: z.number(),
  imagen: z.string().nullable(),
  categoria_id: z.string(),
  activo: z.boolean(),
});

export type ProductoPublicResponseOutput = z.infer<typeof ProductoPublicResponseSchema>;

export const ProductoAdminResponseSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  slug: z.string(),
  descripcion: z.string().nullable(),
  descripcion_breve: z.string().nullable(),
  precio: z.number(),
  stock: z.number(),
  imagen: z.string().nullable(),
  categoria_id: z.string(),
  activo: z.boolean(),
  fecha_creacion: z.string().datetime(),
  fecha_actualizacion: z.string().datetime(),
});

export type ProductoAdminResponseOutput = z.infer<typeof ProductoAdminResponseSchema>;


export const ListarProductosSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarProductosInput = z.infer<typeof ListarProductosSchema>;

export const BuscarProductosSchema = z.object({
  nombre: z.string().trim().optional(),
  categoria_id: z.string().trim().optional(),
  precio_min: z.number().nonnegative().optional(),
  precio_max: z.number().nonnegative().optional(),
  stock_min: z.number().int().nonnegative().optional(),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type BuscarProductosInput = z.infer<typeof BuscarProductosSchema>;

export const ListarPorCategoriaSchema = z.object({
  categoriaId: z.string({ message: "El ID de categoría es obligatorio" }).trim(),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarPorCategoriaInput = z.infer<typeof ListarPorCategoriaSchema>;

export const ObtenerRecientesSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
});

export type ObtenerRecientesInput = z.infer<typeof ObtenerRecientesSchema>;