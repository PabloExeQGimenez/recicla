import { z } from 'zod';

const booleanFromString = z.preprocess((val) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}, z.boolean().optional());

export const listRecuperadoresSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  active: booleanFromString,
});

export type ListRecuperadoresDTO = z.infer<typeof listRecuperadoresSchema>;
