import { z } from "zod";
import { descripcionCategoriaSchema, nombreCategoriaSchema } from "./campos";

export const categoriaProductoCreateSchema = z.object({
  nombre: nombreCategoriaSchema,
  descripcion: descripcionCategoriaSchema.optional(),
});

export const categoriaProductoUpdateSchema = z.object({
  nombre: nombreCategoriaSchema.optional(),
  descripcion: descripcionCategoriaSchema.optional(),
});

