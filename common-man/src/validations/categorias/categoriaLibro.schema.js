import { z } from "zod";
import { descripcionCategoriaSchema, nombreCategoriaSchema } from "./campos";

export const categoriaLibroCreateSchema = z.object({
  nombre: nombreCategoriaSchema,
  descripcion: descripcionCategoriaSchema.optional(),
});

export const categoriaLibroUpdateSchema = z.object({
  nombre: nombreCategoriaSchema.optional(),
  descripcion: descripcionCategoriaSchema.optional(),
});

