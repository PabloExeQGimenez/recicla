import { z } from 'zod';

export const DashboardQuerySchema = z.object({
  year: z.coerce.number().int().min(2015).max(2030).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export type DashboardQueryDTO = z.infer<typeof DashboardQuerySchema>;
