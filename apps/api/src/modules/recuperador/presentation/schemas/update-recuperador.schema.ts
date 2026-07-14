import { z } from 'zod';
import { createRecuperadorSchema } from './create-recuperador.schema';

export const updateRecuperadorSchema = createRecuperadorSchema.partial();

export type UpdateRecuperadorDTO = z.infer<typeof updateRecuperadorSchema>;
