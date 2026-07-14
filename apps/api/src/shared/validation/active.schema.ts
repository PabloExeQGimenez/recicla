import { z } from 'zod';

export const ActiveSchema = z.object({
  active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});

export type ActiveDTO = z.infer<typeof ActiveSchema>;
