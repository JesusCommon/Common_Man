import { z } from "zod";
import { descripcionCategoriaSchema, nombreCategoriaSchema } from "./campos";

export const categoriaCreateSchema = z.object({
  nombre: nombreCategoriaSchema,
  descripcion: descripcionCategoriaSchema.optional(),
});

export const categoriaUpdateSchema = z.object({
  nombre: nombreCategoriaSchema.optional(),
  descripcion: descripcionCategoriaSchema.optional(),
});

