import { z } from "zod";
import { descripcionCategoriaSchema, nombreCategoriaSchema } from "./campos";

export const categoriaTiendaCreateSchema = z.object({
  nombre: nombreCategoriaSchema,
  descripcion: descripcionCategoriaSchema.optional(),
});

export const categoriaTiendaUpdateSchema = z.object({
  nombre: nombreCategoriaSchema.optional(),
  descripcion: descripcionCategoriaSchema.optional(),
});

