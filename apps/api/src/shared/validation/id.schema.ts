import { z } from 'zod';

export const IdSchema = z.object({
  id: z.uuid(),
});

export type IdDTO = z.infer<typeof IdSchema>;
