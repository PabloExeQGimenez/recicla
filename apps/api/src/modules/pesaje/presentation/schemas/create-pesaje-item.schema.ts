import { z } from 'zod';

export const CreatePesajeItemSchema = z.object({
  materialId: z.uuid(),
  weight: z.coerce.number().positive(),
});

export type CreatePesajeItemDTO = z.infer<typeof CreatePesajeItemSchema>;
