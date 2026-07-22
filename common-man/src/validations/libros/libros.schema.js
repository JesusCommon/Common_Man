import { z } from "zod";
import {
  nombreSchema,
  autorSchema,
  descripcionSchema,
  anioPublicacionSchema,
  editorialSchema,
  precioSchema,
  stockSchema,
  portadaSchema,
  contenidoSchema,
  idiomaSchema,
} from "./campos";
import { objectIdSchema } from "../shared/objectId.schema";

export const libroCreateSchema = z.object({
  nombre: nombreSchema,
  autor: autorSchema,
  descripcion: descripcionSchema.optional(),
  anio_publicacion: anioPublicacionSchema,
  portada: portadaSchema.optional(),
  editorial: editorialSchema.optional(),
  idioma: idiomaSchema.default("Español"),
  stock: stockSchema,
  precio: precioSchema,
  categoria: objectIdSchema,
  contenido: contenidoSchema,
});

export const libroUpdateSchema = z.object({
  nombre: nombreSchema.optional(),
  autor: autorSchema.optional(),
  descripcion: descripcionSchema.optional(),
  anio_publicacion: anioPublicacionSchema.optional(),
  portada: portadaSchema.optional(),
  editorial: editorialSchema.optional(),
  idioma: idiomaSchema.optional(),
  stock: stockSchema.optional(),
  precio: precioSchema.optional(),
  categoria: objectIdSchema.optional(),
  contenido: contenidoSchema.optional(),
});