import { z } from "zod";
import {
  nombreProductoSchema,
  codigoSchema,
  descripcionProductoSchema,
  fotografiaSchema,
  precioProductoSchema,
  stockProductoSchema,
  descuentoSchema,
  disponibleSchema,
} from "./campos";
import { objectIdSchema } from "../shared/objectId.schema";

export const productoCreateSchema = z.object({
  nombre: nombreProductoSchema,
  codigo: codigoSchema,
  descripcion: descripcionProductoSchema.optional(),
  fotografia: fotografiaSchema.optional(),
  stock: stockProductoSchema,
  precio: precioProductoSchema,
  descuento: descuentoSchema.optional(),
  disponible: disponibleSchema.default(true),
  categoria: objectIdSchema,
});

export const productoUpdateSchema = z.object({
  nombre: nombreProductoSchema.optional(),
  codigo: codigoSchema.optional(),
  descripcion: descripcionProductoSchema.optional(),
  fotografia: fotografiaSchema.optional(),
  stock: stockProductoSchema.optional(),
  precio: precioProductoSchema.optional(),
  descuento: descuentoSchema.optional(),
  disponible: disponibleSchema.optional(),
  categoria: objectIdSchema.optional(),
});