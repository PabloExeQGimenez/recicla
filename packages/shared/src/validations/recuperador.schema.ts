import { z } from 'zod';

export const createRecuperadorSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  lastName: z.string().trim().min(1, 'El apellido es obligatorio'),
  dni: z.string().trim().optional(),
  cuil: z.string().trim().optional(),
  birthdate: z.string().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Email inválido').optional().or(z.literal('')),
  account: z.string().trim().optional(),
  route: z.string().trim().optional(),
  program: z.string().trim().optional(),
});

export type CreateRecuperadorSchema = z.infer<typeof createRecuperadorSchema>;

export const updateRecuperadorSchema = createRecuperadorSchema.partial();

export type UpdateRecuperadorSchema = z.infer<typeof updateRecuperadorSchema>;
