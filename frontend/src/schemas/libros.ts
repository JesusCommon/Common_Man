import { z } from "zod";
import { objectId, texto, trimOpcional } from "./helpers";

const idiomaEnum = z.enum(["Español", "Ingles", "Portugues"]);

export const LibroCreateSchema = z.object({
  nombre: texto(1, 150, "El nombre"),
  autor_id: objectId,
  editorial_id: objectId,
  genero_id: objectId,
  edicion: trimOpcional(
    z.string().max(100, "La edición no puede exceder 100 caracteres")
  ),
  anio_publicacion: z
    .number()
    .int("El año debe ser un número entero")
    .min(1000, "El año mínimo es 1000")
    .max(2100, "El año máximo es 2100"),
  paginas: z
    .number()
    .int("Las páginas deben ser un número entero")
    .min(1, "El libro debe tener al menos 1 página"),
  idioma: idiomaEnum,
  portada: trimOpcional(z.string().url("La portada debe ser una URL válida")),
  isbn: trimOpcional(
    z
      .string()
      .regex(
        /^(?:[0-9]-?){9}[0-9X]$|^(?:[0-9]-?){12}[0-9]$/,
        "ISBN inválido: debe ser ISBN-10 o ISBN-13"
      )
      .max(20, "El ISBN no puede exceder 20 caracteres")
  ),
  sku: trimOpcional(
    z.string().regex(
      /^[A-Za-z0-9\-_.]{3,50}$/,
      "SKU inválido: 3 a 50 caracteres (letras, números, - _ .)"
    )
  ),
  precio: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .transform((n) => n.toFixed(2)),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  descripcion: trimOpcional(
    z.string().max(1000, "La descripción no puede exceder 1000 caracteres")
  ),
  contenido: z.string().trim().url("El contenido debe ser una URL válida"),
});

export const LibroUpdateSchema = LibroCreateSchema.partial().extend({
  activo: z.boolean().optional(),
});

export const BuscarLibrosParamsSchema = z.object({
  nombre: z.string().trim().optional(),
  autor_id: objectId.optional(),
  editorial_id: objectId.optional(),
  genero_id: objectId.optional(),
  idioma: idiomaEnum.optional(),
  anio_desde: z.number().int().min(1000).max(2100).optional(),
  anio_hasta: z.number().int().min(1000).max(2100).optional(),
  precio_min: z.number().min(0).transform((n) => n.toFixed(2)).optional(),
  precio_max: z.number().min(0).transform((n) => n.toFixed(2)).optional(),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const ListarLibrosAdminParamsSchema = BuscarLibrosParamsSchema.omit({
  anio_desde: true,
  anio_hasta: true,
  precio_min: true,
  precio_max: true,
}).extend({
  solo_activos: z.boolean().optional(),
});

export type LibroCreateInput = z.infer<typeof LibroCreateSchema>;
export type LibroUpdateInput = z.infer<typeof LibroUpdateSchema>;
export type BuscarLibrosParamsInput = z.infer<typeof BuscarLibrosParamsSchema>;
export type ListarLibrosAdminParamsInput = z.infer<
  typeof ListarLibrosAdminParamsSchema
>;