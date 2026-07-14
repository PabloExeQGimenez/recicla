import { z } from 'zod';

export const solicitudPagoSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  excludedPesajeIds: z.array(z.string().uuid()).optional().default([]),
});

export type SolicitudPagoDTO = z.infer<typeof solicitudPagoSchema>;
