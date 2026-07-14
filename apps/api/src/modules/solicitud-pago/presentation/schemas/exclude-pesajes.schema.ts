import { z } from 'zod';

export const excludePesajesSchema = z.object({
  pesajeIds: z
    .array(z.string().uuid())
    .min(1, 'Debe seleccionar al menos un pesaje'),
});

export type ExcludePesajesDTO = z.infer<typeof excludePesajesSchema>;
