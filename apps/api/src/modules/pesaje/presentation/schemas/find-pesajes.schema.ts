import { z } from 'zod';
import { PesajeStatus } from '../../domain/pesaje-status.enum';

export const FindPesajesSchema = z.object({
  recuperadorId: z.uuid().optional(),
  materialId: z.uuid().optional(),
  status: z.enum(PesajeStatus).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(15),
});

export type FindPesajeDTO = z.infer<typeof FindPesajesSchema>;
