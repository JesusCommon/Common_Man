import { z } from "zod";
import { texto, soloLetras, trimOpcional } from "./helpers";

export const AutorCreateSchema = z.object({
  nombre: texto(2, 150, "El nombre").regex(
    soloLetras,
    "El nombre solo puede llevar letras"
  ),
  apellido: texto(2, 150, "El apellido").regex(
    soloLetras,
    "El apellido solo puede llevar letras"
  ),
  pais_nacimiento: trimOpcional(
    z
      .string()
      .min(2, "El país debe tener al menos 2 caracteres")
      .max(50, "El país no puede exceder 50 caracteres")
      .regex(soloLetras, "El país solo puede llevar letras")
  ),
});

export const AutorUpdateSchema = AutorCreateSchema.partial();

export type AutorCreateInput = z.infer<typeof AutorCreateSchema>;
export type AutorUpdateInput = z.infer<typeof AutorUpdateSchema>;