import { z } from "zod";

const NOMBRE_REGEX = /^[A-Za-z0-9À-ÿñÑ\s]+$/;

function toTitleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const nombreCategoriaSchema = z
  .string()
  .trim()
  .min(2, "La categoría tiene que tener al menos 2 caracteres")
  .regex(NOMBRE_REGEX, "La categoría solo puede llevar letras y números")
  .transform(toTitleCase);

export const descripcionCategoriaSchema = z
  .string()
  .trim()
  .max(1000, "La descripción no puede tener más de 1000 caracteres");