import { z } from "zod";
import { texto, trimOpcional } from "./helpers";

export const EditorialCreateSchema = z.object({
  nombre: texto(1, 150, "El nombre"),
  descripcion: trimOpcional(
    z.string().max(1000, "La descripción no puede exceder 1000 caracteres")
  ),
});

export const EditorialUpdateSchema = EditorialCreateSchema.partial();

export type EditorialCreateInput = z.infer<typeof EditorialCreateSchema>;
export type EditorialUpdateInput = z.infer<typeof EditorialUpdateSchema>;