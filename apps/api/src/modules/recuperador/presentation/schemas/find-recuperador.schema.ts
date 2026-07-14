import { z } from 'zod';

export const FindRecuperadorSchema = z.object({
  search: z.string().trim().min(1).optional(),
  active: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }, z.boolean().optional()),

  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(15),
});

export type FindRecuperadorDTO = z.infer<typeof FindRecuperadorSchema>;
