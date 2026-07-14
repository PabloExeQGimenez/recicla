import { z } from 'zod';

export const createMaterialSchema = z.object({
  name: z.string().trim().min(1, 'El nombre del material no puede estar vacío'),
  currentPrice: z.coerce.number().nonnegative('El precio no puede ser negativo'),
});

export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>;

export const changeMaterialPriceSchema = z.object({
  currentPrice: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
});

export type ChangeMaterialPriceSchema = z.infer<typeof changeMaterialPriceSchema>;
