import { z } from "zod";

const NombreCategoriaSchema = z
  .string({ message: "El nombre es obligatorio" })
  .trim()
  .min(2, "El nombre tiene que tener al menos 2 caracteres")
  .max(150, "El nombre no puede superar los 150 caracteres")
  .regex(/^[A-Za-zÀ-ÿñÑ0-9\s]+$/, "El nombre solo puede llevar letras y numeros");

const DescripcionCategoriaSchema = z
  .string()
  .trim()
  .max(280, "La descripcion no puede tener más de 280 caracteres");

export const CategoriaCreateSchema = z.object({
  nombre: NombreCategoriaSchema,
  descripcion: DescripcionCategoriaSchema.optional(),
});

export type CategoriaCreateInput = z.infer<typeof CategoriaCreateSchema>;

export const CategoriaUpdateSchema = z.object({
  nombre: NombreCategoriaSchema.optional(),
  descripcion: DescripcionCategoriaSchema.optional(),
});

export type CategoriaUpdateInput = z.infer<typeof CategoriaUpdateSchema>;

export const CategoriaResponseSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  activo: z.boolean(),
  fecha_creacion: z.string().datetime(),
  fecha_actualizacion: z.string().datetime(),
});

export type CategoriaResponseOutput = z.infer<typeof CategoriaResponseSchema>;

export const CategoriaPublicaResponseSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  slug: z.string(),
});

export type CategoriaPublicaResponseOutput = z.infer<typeof CategoriaPublicaResponseSchema>;

export const ListarCategoriasSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarCategoriasInput = z.infer<typeof ListarCategoriasSchema>;