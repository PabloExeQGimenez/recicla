import { z } from 'zod';

export const createPesajeItemSchema = z.object({
  materialId: z.string().uuid('ID de material inválido'),
  weight: z.coerce.number().positive('El peso debe ser mayor a 0'),
});

export type CreatePesajeItemSchema = z.infer<typeof createPesajeItemSchema>;

export const createPesajeSchema = z.object({
  recuperadorId: z.string().uuid('ID de recuperador inválido'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  items: z
    .array(createPesajeItemSchema)
    .min(1, 'El pesaje debe contener al menos un item'),
});

export type CreatePesajeSchema = z.infer<typeof createPesajeSchema>;
