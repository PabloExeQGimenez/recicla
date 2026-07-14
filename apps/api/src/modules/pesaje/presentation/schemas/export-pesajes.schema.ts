import { z } from 'zod';
import { PesajeStatus } from '../../domain/pesaje-status.enum';

export const ExportPesajesSchema = z.object({
  recuperadorId: z.uuid().optional(),
  materialId: z.uuid().optional(),
  status: z.enum(PesajeStatus).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ExportPesajesDTO = z.infer<typeof ExportPesajesSchema>;
