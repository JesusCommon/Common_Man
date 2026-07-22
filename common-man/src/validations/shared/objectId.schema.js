import { z } from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z
  .string()
  .regex(OBJECT_ID_REGEX, "El identificador no es un ObjectId válido");