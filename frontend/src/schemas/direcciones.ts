import { z } from "zod";

const AliasDireccionSchema = z
  .string({ message: "El alias es obligatorio" })
  .trim()
  .min(1, "El alias no puede estar vacío")
  .max(50, "El alias no puede superar los 50 caracteres");

const NombreDestinatarioSchema = z
  .string({ message: "El nombre del destinatario es obligatorio" })
  .trim()
  .min(3, "El nombre del destinatario debe tener al menos 3 caracteres")
  .max(150, "El nombre del destinatario no puede superar los 150 caracteres");

const TelefonoDireccionSchema = z
  .string({ message: "El teléfono es obligatorio" })
  .trim()
  .regex(/^[0-9+\-\s()]{7,15}$/, "El teléfono debe contener entre 7 y 15 dígitos");

const DireccionTextoSchema = z
  .string({ message: "La dirección es obligatoria" })
  .trim()
  .min(5, "La dirección debe tener al menos 5 caracteres")
  .max(200, "La dirección no puede superar los 200 caracteres");

const TextoOpcionalSchema = z
  .string()
  .trim()
  .max(200, "El texto no puede superar los 200 caracteres")
  .optional();

const CiudadSchema = z
  .string({ message: "La ciudad es obligatoria" })
  .trim()
  .min(2, "La ciudad debe tener al menos 2 caracteres");

const DepartamentoSchema = z
  .string({ message: "El departamento es obligatorio" })
  .trim()
  .min(2, "El departamento debe tener al menos 2 caracteres");

const CodigoPostalSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{6}$/, "El código postal en Colombia debe tener 6 dígitos numéricos")
  .optional();

const PaisSchema = z
  .string()
  .trim()
  .min(2, "El país debe tener al menos 2 caracteres")
  .default("Colombia");

export const DireccionCreateSchema = z.object({
  alias: AliasDireccionSchema,
  nombre_destinatario: NombreDestinatarioSchema,
  telefono: TelefonoDireccionSchema,
  direccion: DireccionTextoSchema,
  complemento: TextoOpcionalSchema,
  barrio: TextoOpcionalSchema,
  ciudad: CiudadSchema,
  departamento: DepartamentoSchema,
  codigo_postal: CodigoPostalSchema,
  pais: PaisSchema,
  referencias: TextoOpcionalSchema,
  es_predeterminada: z.boolean().default(false),
});

export type DireccionCreateInput = z.infer<typeof DireccionCreateSchema>;

export const DireccionUpdateSchema = DireccionCreateSchema.partial();

export type DireccionUpdateInput = z.infer<typeof DireccionUpdateSchema>;

export const DireccionResponseSchema = z.object({
  id: z.string(),
  alias: z.string(),
  nombre_destinatario: z.string(),
  telefono: z.string(),
  direccion: z.string(),
  complemento: z.string().nullable(),
  barrio: z.string().nullable(),
  ciudad: z.string(),
  departamento: z.string(),
  codigo_postal: z.string().nullable(),
  pais: z.string(),
  referencias: z.string().nullable(),
  es_predeterminada: z.boolean(),
  fecha_creacion: z.string().datetime(),
  fecha_actualizacion: z.string().datetime(),
});

export type DireccionResponseOutput = z.infer<typeof DireccionResponseSchema>;

export const DireccionAdminResponseSchema = DireccionResponseSchema.extend({
  usuario_id: z.string(),
  activo: z.boolean(),
});

export type DireccionAdminResponseOutput = z.infer<typeof DireccionAdminResponseSchema>;

export const ListarDireccionesSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarDireccionesInput = z.infer<typeof ListarDireccionesSchema>;