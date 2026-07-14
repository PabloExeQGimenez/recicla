import { z } from 'zod';
import { CreatePesajeItemSchema } from './create-pesaje-item.schema';

export const CreatePesajeSchema = z.object({
  recuperadorId: z.uuid(),
  date: z.coerce.date(),
  items: z
    .array(CreatePesajeItemSchema)
    .min(1, 'El pesaje debe contener al menos un item'),
});

export type CreatePesajeDTO = z.infer<typeof CreatePesajeSchema>;
